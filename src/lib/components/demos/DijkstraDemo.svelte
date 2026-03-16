<script lang="ts">
	import { onMount } from 'svelte';
	import { locale } from '../../../messages/i18n';

	// ─── State ───
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	let nodeCount = $state(30);
	let speed = $state(50);
	let algorithm = $state<'dijkstra' | 'astar'>('dijkstra');
	let isRunning = $state(false);
	let isFinished = $state(false);
	let visitedCount = $state(0);
	let pathLength = $state(0);
	let statusText = $state('');

	interface Node {
		id: number;
		x: number;
		y: number;
		neighbors: { node: number; weight: number }[];
		state: 'idle' | 'visiting' | 'visited' | 'path' | 'start' | 'end';
	}

	interface Edge {
		from: number;
		to: number;
		weight: number;
	}

	let nodes: Node[] = [];
	let edges: Edge[] = [];
	let startNode = 0;
	let endNode = 0;
	let animationId: number | null = null;
	let canvasWidth = 0;
	let canvasHeight = 0;
	const PADDING = 30;
	const NODE_RADIUS = 8;
	const MAX_EDGE_DISTANCE = 180;

	// ─── Graph Generation ───
	function generateGraph() {
		stopAnimation();
		isFinished = false;
		visitedCount = 0;
		pathLength = 0;
		statusText = $locale === 'fr' ? 'Prêt' : 'Ready';

		const w = canvasWidth - PADDING * 2;
		const h = canvasHeight - PADDING * 2;

		// Generate nodes with Poisson-like spacing
		nodes = [];
		const minDist = Math.max(40, Math.sqrt((w * h) / nodeCount) * 0.6);
		let attempts = 0;

		while (nodes.length < nodeCount && attempts < nodeCount * 50) {
			const x = PADDING + Math.random() * w;
			const y = PADDING + Math.random() * h;

			let tooClose = false;
			for (const n of nodes) {
				const dx = n.x - x;
				const dy = n.y - y;
				if (Math.sqrt(dx * dx + dy * dy) < minDist) {
					tooClose = true;
					break;
				}
			}

			if (!tooClose) {
				nodes.push({
					id: nodes.length,
					x,
					y,
					neighbors: [],
					state: 'idle'
				});
			}
			attempts++;
		}

		// Generate edges (connect nearby nodes)
		edges = [];
		for (let i = 0; i < nodes.length; i++) {
			nodes[i].neighbors = [];
		}

		for (let i = 0; i < nodes.length; i++) {
			const nearby: { idx: number; dist: number }[] = [];
			for (let j = 0; j < nodes.length; j++) {
				if (i === j) continue;
				const dx = nodes[i].x - nodes[j].x;
				const dy = nodes[i].y - nodes[j].y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < MAX_EDGE_DISTANCE) {
					nearby.push({ idx: j, dist });
				}
			}

			// Sort by distance and connect to closest 3-5
			nearby.sort((a, b) => a.dist - b.dist);
			const maxConnections = Math.min(nearby.length, 2 + Math.floor(Math.random() * 3));

			for (let k = 0; k < maxConnections; k++) {
				const { idx, dist } = nearby[k];
				const weight = Math.round(dist);

				// Avoid duplicate edges
				const exists = nodes[i].neighbors.some((n) => n.node === idx);
				if (!exists) {
					nodes[i].neighbors.push({ node: idx, weight });
					nodes[idx].neighbors.push({ node: i, weight });
					edges.push({ from: i, to: idx, weight });
				}
			}
		}

		// Ensure graph connectivity by connecting components
		const componentOf = new Array(nodes.length).fill(-1);
		let componentCount = 0;
		for (let i = 0; i < nodes.length; i++) {
			if (componentOf[i] !== -1) continue;
			const queue = [i];
			componentOf[i] = componentCount;
			while (queue.length > 0) {
				const cur = queue.shift()!;
				for (const nb of nodes[cur].neighbors) {
					if (componentOf[nb.node] === -1) {
						componentOf[nb.node] = componentCount;
						queue.push(nb.node);
					}
				}
			}
			componentCount++;
		}

		// Connect disconnected components
		if (componentCount > 1) {
			for (let c = 1; c < componentCount; c++) {
				let bestDist = Infinity;
				let bestI = 0;
				let bestJ = 0;
				for (let i = 0; i < nodes.length; i++) {
					if (componentOf[i] !== 0) continue;
					for (let j = 0; j < nodes.length; j++) {
						if (componentOf[j] !== c) continue;
						const dx = nodes[i].x - nodes[j].x;
						const dy = nodes[i].y - nodes[j].y;
						const dist = Math.sqrt(dx * dx + dy * dy);
						if (dist < bestDist) {
							bestDist = dist;
							bestI = i;
							bestJ = j;
						}
					}
				}
				const weight = Math.round(bestDist);
				nodes[bestI].neighbors.push({ node: bestJ, weight });
				nodes[bestJ].neighbors.push({ node: bestI, weight });
				edges.push({ from: bestI, to: bestJ, weight });

				// Merge components
				for (let i = 0; i < nodes.length; i++) {
					if (componentOf[i] === c) componentOf[i] = 0;
				}
			}
		}

		// Pick start and end (far apart)
		let maxDist = 0;
		for (let i = 0; i < nodes.length; i++) {
			for (let j = i + 1; j < nodes.length; j++) {
				const dx = nodes[i].x - nodes[j].x;
				const dy = nodes[i].y - nodes[j].y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist > maxDist) {
					maxDist = dist;
					startNode = i;
					endNode = j;
				}
			}
		}

		nodes[startNode].state = 'start';
		nodes[endNode].state = 'end';
		draw();
	}

	// ─── Pathfinding ───
	async function runAlgorithm() {
		if (isRunning) return;
		isRunning = true;
		isFinished = false;
		visitedCount = 0;
		pathLength = 0;
		statusText = $locale === 'fr' ? 'Recherche en cours...' : 'Searching...';

		// Reset node states
		for (const node of nodes) {
			if (node.id !== startNode && node.id !== endNode) {
				node.state = 'idle';
			}
		}
		draw();

		const dist = new Array(nodes.length).fill(Infinity);
		const prev = new Array(nodes.length).fill(-1);
		const visited = new Set<number>();
		dist[startNode] = 0;

		// Priority queue (simple array-based)
		type PQItem = { node: number; priority: number };
		const pq: PQItem[] = [{ node: startNode, priority: 0 }];

		function heuristic(a: number, b: number): number {
			if (algorithm !== 'astar') return 0;
			const dx = nodes[a].x - nodes[b].x;
			const dy = nodes[a].y - nodes[b].y;
			return Math.sqrt(dx * dx + dy * dy);
		}

		function popMin(): PQItem | undefined {
			let minIdx = 0;
			for (let i = 1; i < pq.length; i++) {
				if (pq[i].priority < pq[minIdx].priority) minIdx = i;
			}
			return pq.splice(minIdx, 1)[0];
		}

		while (pq.length > 0) {
			const current = popMin()!;
			const u = current.node;

			if (visited.has(u)) continue;
			visited.add(u);
			visitedCount = visited.size;

			if (u !== startNode && u !== endNode) {
				nodes[u].state = 'visiting';
				draw();
				await sleep(Math.max(5, 105 - speed));
				nodes[u].state = 'visited';
				draw();
			}

			if (u === endNode) break;

			for (const nb of nodes[u].neighbors) {
				if (visited.has(nb.node)) continue;
				const newDist = dist[u] + nb.weight;
				if (newDist < dist[nb.node]) {
					dist[nb.node] = newDist;
					prev[nb.node] = u;
					pq.push({ node: nb.node, priority: newDist + heuristic(nb.node, endNode) });
				}
			}
		}

		// Reconstruct path
		const path: number[] = [];
		let current = endNode;
		while (current !== -1) {
			path.unshift(current);
			current = prev[current];
		}

		if (path[0] === startNode) {
			pathLength = Math.round(dist[endNode]);
			for (const nodeId of path) {
				if (nodeId !== startNode && nodeId !== endNode) {
					nodes[nodeId].state = 'path';
					draw();
					await sleep(Math.max(10, 80 - speed * 0.5));
				}
			}
			statusText =
				$locale === 'fr'
					? `Chemin trouvé ! Distance: ${pathLength}`
					: `Path found! Distance: ${pathLength}`;
		} else {
			statusText = $locale === 'fr' ? 'Aucun chemin trouvé' : 'No path found';
		}

		isRunning = false;
		isFinished = true;
		draw();
	}

	function sleep(ms: number): Promise<void> {
		return new Promise((r) => setTimeout(r, ms));
	}

	function stopAnimation() {
		isRunning = false;
		if (animationId) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
	}

	// ─── Drawing ───
	function draw() {
		if (!ctx) return;
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		// Draw edges
		for (const edge of edges) {
			const from = nodes[edge.from];
			const to = nodes[edge.to];

			const isPath =
				(from.state === 'path' || from.state === 'start') &&
				(to.state === 'path' || to.state === 'end');
			const isPathReverse =
				(from.state === 'path' || from.state === 'end') &&
				(to.state === 'path' || to.state === 'start');

			ctx.beginPath();
			ctx.moveTo(from.x, from.y);
			ctx.lineTo(to.x, to.y);

			if (isPath || isPathReverse) {
				ctx.strokeStyle = '#00e5ff';
				ctx.lineWidth = 3;
				ctx.shadowColor = '#00e5ff';
				ctx.shadowBlur = 8;
			} else {
				ctx.strokeStyle = 'rgba(192, 192, 192, 0.15)';
				ctx.lineWidth = 1;
				ctx.shadowBlur = 0;
			}
			ctx.stroke();
			ctx.shadowBlur = 0;
		}

		// Draw nodes
		for (const node of nodes) {
			ctx.beginPath();
			ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);

			switch (node.state) {
				case 'start':
					ctx.fillStyle = '#4caf50';
					ctx.shadowColor = '#4caf50';
					ctx.shadowBlur = 12;
					break;
				case 'end':
					ctx.fillStyle = '#e63946';
					ctx.shadowColor = '#e63946';
					ctx.shadowBlur = 12;
					break;
				case 'visiting':
					ctx.fillStyle = '#ffb74d';
					ctx.shadowColor = '#ffb74d';
					ctx.shadowBlur = 10;
					break;
				case 'visited':
					ctx.fillStyle = '#ff8a65';
					ctx.shadowColor = '#ff8a65';
					ctx.shadowBlur = 4;
					break;
				case 'path':
					ctx.fillStyle = '#00e5ff';
					ctx.shadowColor = '#00e5ff';
					ctx.shadowBlur = 12;
					break;
				default:
					ctx.fillStyle = 'rgba(192, 192, 192, 0.5)';
					ctx.shadowBlur = 0;
			}

			ctx.fill();
			ctx.shadowBlur = 0;

			// Node border
			ctx.beginPath();
			ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
			ctx.strokeStyle =
				node.state === 'idle' ? 'rgba(192, 192, 192, 0.3)' : 'rgba(255,255,255,0.6)';
			ctx.lineWidth = 1.5;
			ctx.stroke();
		}
	}

	function handleResize() {
		if (!canvas) return;
		const rect = canvas.parentElement!.getBoundingClientRect();
		canvasWidth = rect.width;
		canvasHeight = 450;
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		ctx = canvas.getContext('2d')!;
		generateGraph();
	}

	onMount(() => {
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			stopAnimation();
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div class="demo-wrapper">
	<div class="canvas-container">
		<canvas bind:this={canvas}></canvas>
		{#if statusText}
			<div class="status-badge" class:finished={isFinished}>
				{statusText}
			</div>
		{/if}
	</div>

	<div class="controls-panel">
		<div class="controls-row">
			<div class="control-group">
				<label class="control-label" for="algo-select">
					{$locale === 'fr' ? 'Algorithme' : 'Algorithm'}
				</label>
				<div class="toggle-group">
					<button
						class="toggle-btn"
						class:active={algorithm === 'dijkstra'}
						onclick={() => (algorithm = 'dijkstra')}
						disabled={isRunning}
					>
						Dijkstra
					</button>
					<button
						class="toggle-btn"
						class:active={algorithm === 'astar'}
						onclick={() => (algorithm = 'astar')}
						disabled={isRunning}
					>
						A*
					</button>
				</div>
			</div>

			<div class="control-group">
				<label class="control-label" for="node-slider">
					{$locale === 'fr' ? 'Nœuds' : 'Nodes'}: {nodeCount}
				</label>
				<input
					id="node-slider"
					type="range"
					min="10"
					max="80"
					step="5"
					bind:value={nodeCount}
					disabled={isRunning}
					class="slider"
				/>
			</div>

			<div class="control-group">
				<label class="control-label" for="speed-slider">
					{$locale === 'fr' ? 'Vitesse' : 'Speed'}: {speed}%
				</label>
				<input
					id="speed-slider"
					type="range"
					min="10"
					max="100"
					step="5"
					bind:value={speed}
					class="slider"
				/>
			</div>
		</div>

		<div class="actions-row">
			<button
				class="action-btn regenerate-btn"
				onclick={generateGraph}
				disabled={isRunning}
			>
				🔄 {$locale === 'fr' ? 'Régénérer' : 'Regenerate'}
			</button>
			<button
				class="action-btn start-btn"
				onclick={runAlgorithm}
				disabled={isRunning}
			>
				{#if isRunning}
					⏳ {$locale === 'fr' ? 'En cours...' : 'Running...'}
				{:else}
					▶ {$locale === 'fr' ? 'Lancer' : 'Start'}
				{/if}
			</button>
		</div>

		{#if visitedCount > 0}
			<div class="stats-row">
				<div class="stat">
					<span class="stat-value">{visitedCount}</span>
					<span class="stat-label">{$locale === 'fr' ? 'Nœuds visités' : 'Nodes visited'}</span>
				</div>
				{#if pathLength > 0}
					<div class="stat">
						<span class="stat-value">{pathLength}</span>
						<span class="stat-label">Distance</span>
					</div>
				{/if}
				<div class="stat">
					<span class="stat-value">{algorithm === 'dijkstra' ? 'Dijkstra' : 'A*'}</span>
					<span class="stat-label">{$locale === 'fr' ? 'Algorithme' : 'Algorithm'}</span>
				</div>
			</div>
		{/if}
	</div>

	<div class="legend-row">
		<div class="legend-item"><span class="legend-dot start-dot"></span> {$locale === 'fr' ? 'Départ' : 'Start'}</div>
		<div class="legend-item"><span class="legend-dot end-dot"></span> {$locale === 'fr' ? 'Arrivée' : 'End'}</div>
		<div class="legend-item"><span class="legend-dot visiting-dot"></span> {$locale === 'fr' ? 'En cours' : 'Exploring'}</div>
		<div class="legend-item"><span class="legend-dot visited-dot"></span> {$locale === 'fr' ? 'Visité' : 'Visited'}</div>
		<div class="legend-item"><span class="legend-dot path-dot"></span> {$locale === 'fr' ? 'Chemin' : 'Path'}</div>
	</div>
</div>

<style>
	.demo-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.canvas-container {
		position: relative;
		width: 100%;
		border-radius: var(--radius-lg);
		border: 2px solid rgba(192, 192, 192, 0.2);
		overflow: hidden;
		background: var(--color-carbon-dark);
	}

	canvas {
		display: block;
		width: 100%;
	}

	.status-badge {
		position: absolute;
		top: var(--space-3);
		right: var(--space-3);
		padding: var(--space-2) var(--space-4);
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-chrome-light);
		background: rgba(0, 0, 0, 0.7);
		border: 1px solid rgba(192, 192, 192, 0.2);
		border-radius: var(--radius-md);
		backdrop-filter: blur(4px);
	}

	.status-badge.finished {
		color: #00e5ff;
		border-color: rgba(0, 229, 255, 0.3);
	}

	.controls-panel {
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(192, 192, 192, 0.15);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.controls-row {
		display: flex;
		gap: var(--space-6);
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.control-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		flex: 1;
		min-width: 140px;
	}

	.control-label {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-chrome);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.toggle-group {
		display: flex;
		gap: 2px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: var(--radius-md);
		padding: 2px;
	}

	.toggle-btn {
		padding: var(--space-2) var(--space-4);
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-muted);
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.toggle-btn.active {
		color: var(--color-white);
		background: var(--color-plate-blue);
	}

	.toggle-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 6px;
		background: rgba(192, 192, 192, 0.2);
		border-radius: var(--radius-full);
		outline: none;
		cursor: pointer;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--color-plate-blue);
		border: 2px solid var(--color-white);
		cursor: pointer;
		transition: box-shadow var(--transition-fast);
	}

	.slider::-webkit-slider-thumb:hover {
		box-shadow: 0 0 8px rgba(29, 78, 216, 0.5);
	}

	.slider:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.actions-row {
		display: flex;
		justify-content: center;
		gap: var(--space-4);
	}

	.action-btn {
		padding: var(--space-3) var(--space-6);
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: var(--text-base);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-base);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.regenerate-btn {
		color: var(--color-white);
		background: rgba(192, 192, 192, 0.2);
		border: 1px solid rgba(192, 192, 192, 0.3);
	}

	.regenerate-btn:hover:not(:disabled) {
		background: rgba(192, 192, 192, 0.3);
	}

	.start-btn {
		color: var(--color-white);
		background: var(--color-racing-red);
	}

	.start-btn:hover:not(:disabled) {
		background: var(--color-racing-red-light);
		box-shadow: var(--shadow-glow-red);
		transform: translateY(-2px);
	}

	.stats-row {
		display: flex;
		justify-content: center;
		gap: var(--space-8);
		padding-top: var(--space-2);
		border-top: 1px solid rgba(192, 192, 192, 0.1);
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.stat-value {
		font-family: var(--font-display);
		font-size: var(--text-lg);
		font-weight: 700;
		color: #00e5ff;
	}

	.stat-label {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.legend-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-3) var(--space-5);
		padding: var(--space-2);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-body);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.legend-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.start-dot { background: #4caf50; box-shadow: 0 0 6px rgba(76, 175, 80, 0.5); }
	.end-dot { background: #e63946; box-shadow: 0 0 6px rgba(230, 57, 70, 0.5); }
	.visiting-dot { background: #ffb74d; box-shadow: 0 0 6px rgba(255, 183, 77, 0.5); }
	.visited-dot { background: #ff8a65; }
	.path-dot { background: #00e5ff; box-shadow: 0 0 6px rgba(0, 229, 255, 0.5); }

	@media (max-width: 640px) {
		.controls-row {
			flex-direction: column;
			gap: var(--space-3);
		}

		.stats-row {
			flex-direction: column;
			gap: var(--space-2);
		}
	}
</style>
