<script lang="ts">
	import { onMount } from 'svelte';
	import '../../public/timeline.css';
	import { t, locale } from '../../messages/i18n';

	let currentGear = $state(1);
	let timelineWrapperRef: HTMLElement;
	let timelineRef: HTMLElement;
	let canvasRef: HTMLCanvasElement;
	let isAnimating = $state(false);

	const TOTAL_GEARS = 7;
	const gears = ['gear1', 'gear2', 'gear3', 'gear4', 'gear5', 'gear6', 'gear7'] as const;

	// Canvas dimensions
	const CANVAS_WIDTH = 600;
	const CANVAS_HEIGHT = 300;

	// 7-gear H-pattern layout
	const COL_SPACING = 130;
	const BASE_X = 70;
	const TOP_Y = 60;
	const CENTER_Y = 150;
	const BOTTOM_Y = 240;

	const GEAR_POSITIONS: Record<number, { x: number; y: number }> = {
		1: { x: BASE_X, y: TOP_Y },
		2: { x: BASE_X, y: BOTTOM_Y },
		3: { x: BASE_X + COL_SPACING, y: TOP_Y },
		4: { x: BASE_X + COL_SPACING, y: BOTTOM_Y },
		5: { x: BASE_X + COL_SPACING * 2, y: TOP_Y },
		6: { x: BASE_X + COL_SPACING * 2, y: BOTTOM_Y },
		7: { x: BASE_X + COL_SPACING * 3, y: TOP_Y }
	};
	
	// Animation state
	let knobX = $state(GEAR_POSITIONS[1].x);
	let knobY = $state(GEAR_POSITIONS[1].y);
	let animationId: number | null = null;

	function getPath(from: number, to: number): { x: number; y: number }[] {
		const fromPos = GEAR_POSITIONS[from];
		const toPos = GEAR_POSITIONS[to];
		const fromCol = Math.floor((from + 1) / 2);
		const toCol = Math.floor((to + 1) / 2);

		if (fromCol === toCol) {
			return [fromPos, toPos];
		}

		return [
			fromPos,
			{ x: fromPos.x, y: CENTER_Y },
			{ x: toPos.x, y: CENTER_Y },
			toPos
		];
	}

	function easeInOutQuad(t: number): number {
		return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
	}

	function animateToGear(newGear: number) {
		if (isAnimating || newGear === currentGear || newGear < 1 || newGear > TOTAL_GEARS) return;

		isAnimating = true;

		const path = getPath(currentGear, newGear);
		const duration = 200;
		const startTime = performance.now();

		let totalLength = 0;
		const segmentLengths: number[] = [];
		for (let i = 1; i < path.length; i++) {
			const dx = path[i].x - path[i - 1].x;
			const dy = path[i].y - path[i - 1].y;
			const len = Math.sqrt(dx * dx + dy * dy);
			segmentLengths.push(len);
			totalLength += len;
		}

		function animate(time: number) {
			const elapsed = time - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easedProgress = easeInOutQuad(progress);

			const targetDistance = easedProgress * totalLength;
			let currentDistance = 0;

			for (let i = 0; i < segmentLengths.length; i++) {
				if (currentDistance + segmentLengths[i] >= targetDistance) {
					const segmentProgress = (targetDistance - currentDistance) / segmentLengths[i];
					knobX = path[i].x + (path[i + 1].x - path[i].x) * segmentProgress;
					knobY = path[i].y + (path[i + 1].y - path[i].y) * segmentProgress;
					break;
				}
				currentDistance += segmentLengths[i];
			}

			drawCanvas();

			if (progress < 1) {
				animationId = requestAnimationFrame(animate);
			} else {
				knobX = GEAR_POSITIONS[newGear].x;
				knobY = GEAR_POSITIONS[newGear].y;
				currentGear = newGear;
				isAnimating = false;
				drawCanvas();

				// Re-check position: if user scrolled during animation, catch up
				const correctGear = getGearFromScroll();
				if (correctGear > 0 && correctGear !== currentGear) {
					animateToGear(correctGear);
				}
			}
		}

		animationId = requestAnimationFrame(animate);
	}



	function drawCanvas() {
		if (!canvasRef) return;
		const ctx = canvasRef.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		ctx.strokeStyle = '#505050';
		ctx.lineWidth = 5;
		ctx.lineCap = 'round';

		// Vertical lines
		for (let col = 0; col < 4; col++) {
			const x = BASE_X + col * COL_SPACING;
			const hasBottom = col < 3;

			ctx.beginPath();
			ctx.moveTo(x, TOP_Y);
			ctx.lineTo(x, hasBottom ? BOTTOM_Y : CENTER_Y);
			ctx.stroke();
		}

		// Horizontal bar
		ctx.beginPath();
		ctx.moveTo(BASE_X, CENTER_Y);
		ctx.lineTo(BASE_X + COL_SPACING * 3, CENTER_Y);
		ctx.stroke();

		// Gear labels
		ctx.font = 'bold 22px "Orbitron", monospace';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		for (let gear = 1; gear <= TOTAL_GEARS; gear++) {
			const pos = GEAR_POSITIONS[gear];
			const isTop = gear % 2 === 1;
			const labelY = isTop ? pos.y - 30 : pos.y + 30;

			ctx.fillStyle = currentGear === gear ? '#e63946' : '#c0c0c0';
			ctx.fillText(String(gear), pos.x, labelY);
		}

		// Knob glow
		const gradient = ctx.createRadialGradient(knobX, knobY, 0, knobX, knobY, 35);
		gradient.addColorStop(0, 'rgba(230, 57, 70, 0.4)');
		gradient.addColorStop(1, 'rgba(230, 57, 70, 0)');
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(knobX, knobY, 35, 0, Math.PI * 2);
		ctx.fill();

		// Knob
		ctx.fillStyle = '#e63946';
		ctx.strokeStyle = '#ff6b6b';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(knobX, knobY, 18, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		// Highlight
		ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
		ctx.beginPath();
		ctx.arc(knobX - 4, knobY - 4, 5, 0, Math.PI * 2);
		ctx.fill();
	}

	// Threshold record: maps scroll progress breakpoints to gears
	// progress < 0.15 → gear 1, 0.15–0.30 → gear 2, etc.
	const GEAR_THRESHOLDS: [number, number][] = [
		[0.00, 1],
		[0.15, 2],
		[0.30, 3],
		[0.45, 4],
		[0.60, 5],
		[0.75, 6],
		[0.90, 7]
	];

	function getGearFromScroll(): number {
		if (!timelineWrapperRef) return 0;

		const wrapperRect = timelineWrapperRef.getBoundingClientRect();
		const scrollableHeight = wrapperRect.height - window.innerHeight;

		// Not enough scroll space or wrapper not in view
		if (scrollableHeight <= 0) return 0;

		// progress: 0 = wrapper top at viewport top, 1 = wrapper bottom at viewport bottom
		const progress = Math.max(0, Math.min(1, -wrapperRect.top / scrollableHeight));

		// Walk thresholds in reverse to find the matching gear
		for (let i = GEAR_THRESHOLDS.length - 1; i >= 0; i--) {
			if (progress >= GEAR_THRESHOLDS[i][0]) {
				return GEAR_THRESHOLDS[i][1];
			}
		}

		return 1;
	}

	onMount(() => {
		drawCanvas();

		const handleScroll = () => {
			if (!timelineWrapperRef) return;

			const targetGear = getGearFromScroll();

			// 0 means wrapper is not scrollable / not in view
			if (targetGear === 0) return;

			if (targetGear !== currentGear && !isAnimating) {
				animateToGear(targetGear);
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		// Initial check in case page is already scrolled
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (animationId) cancelAnimationFrame(animationId);
		};
	});
</script>

<div class="timeline-wrapper" bind:this={timelineWrapperRef}>
	<div class="timeline" bind:this={timelineRef}>
		<h2 class="timeline-title">{t($locale, 'timeline.title')}</h2>

		<div class="timeline-layout">
			<!-- Left: Content card (only current gear) -->
			<div class="content-side">
				{#each gears as gear, index}
					{@const gearNum = index + 1}
					<div
						class="content-card"
						class:visible={currentGear === gearNum}
						class:hidden={currentGear !== gearNum}
					>
						<div class="card-header">
							<span class="gear-badge">{gearNum}</span>
							<span class="card-title">{t($locale, `timeline.${gear}.title`)}</span>
						</div>
						<h3 class="card-date">{t($locale, `timeline.${gear}.location`)}
							{' '}
							{t($locale, `timeline.${gear}.date`)}
						</h3>
						<p class="card-description">{t($locale, `timeline.${gear}.description`)}</p>
					</div>
				{/each}
			</div>

			<!-- Right: Centered gearbox -->
			<div class="gearbox-side">
				<div class="canvas-wrapper">
					<canvas
						bind:this={canvasRef}
						width={CANVAS_WIDTH}
						height={CANVAS_HEIGHT}
						class="gearbox-canvas"
					></canvas>
				</div>
				<div class="gear-display">
					<span class="current-gear">{currentGear}</span>
				</div>
			</div>
		</div>
	</div>
</div>
