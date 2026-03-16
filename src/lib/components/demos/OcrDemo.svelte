<script lang="ts">
	import { onMount } from 'svelte';
	import { locale } from '../../../messages/i18n';

	let dropZone = $state<HTMLDivElement>(null!);
	let fileInput = $state<HTMLInputElement>(null!);
	let isDragging = $state(false);
	let isProcessing = $state(false);
	let fileName = $state('');
	let pageCount = $state(0);
	let charCount = $state(0);
	let processingTime = $state(0);
	let extractedPages = $state<{ pageNum: number; text: string }[]>([]);
	let errorMessage = $state('');
	let copied = $state(false);
	let pdfjsLoaded = $state(false);

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			processFile(files[0]);
		}
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			processFile(target.files[0]);
		}
	}

	async function processFile(file: File) {
		if (!file.name.toLowerCase().endsWith('.pdf')) {
			errorMessage =
				$locale === 'fr'
					? 'Seuls les fichiers PDF sont acceptés.'
					: 'Only PDF files are accepted.';
			return;
		}

		errorMessage = '';
		isProcessing = true;
		fileName = file.name;
		extractedPages = [];
		pageCount = 0;
		charCount = 0;

		const startTime = performance.now();

		try {
			const arrayBuffer = await file.arrayBuffer();
			const pdfjsLib = (window as any).pdfjsLib;

			const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
			pageCount = pdf.numPages;

			const pages: { pageNum: number; text: string }[] = [];

			for (let i = 1; i <= pdf.numPages; i++) {
				const page = await pdf.getPage(i);
				const textContent = await page.getTextContent();

				// Group text items by Y position to reconstruct lines
				const items = textContent.items as any[];
				const lines: Map<number, { x: number; text: string }[]> = new Map();

				for (const item of items) {
					if (!item.str) continue;
					// Round Y to group nearby items into the same line
					const y = Math.round(item.transform[5] * 10) / 10;
					if (!lines.has(y)) {
						lines.set(y, []);
					}
					lines.get(y)!.push({ x: item.transform[4], text: item.str });
				}

				// Sort lines by Y (descending = top to bottom) and items by X
				const sortedYs = [...lines.keys()].sort((a, b) => b - a);
				const pageText = sortedYs
					.map((y) => {
						const lineItems = lines.get(y)!;
						lineItems.sort((a, b) => a.x - b.x);
						return lineItems.map((item) => item.text).join(' ');
					})
					.filter((line) => line.trim().length > 0)
					.join('\n');

				pages.push({ pageNum: i, text: pageText });
			}

			extractedPages = pages;
			charCount = pages.reduce((sum, p) => sum + p.text.length, 0);
		} catch (err: any) {
			errorMessage =
				$locale === 'fr'
					? `Erreur lors du traitement : ${err.message}`
					: `Processing error: ${err.message}`;
		}

		processingTime = Math.round(performance.now() - startTime);
		isProcessing = false;
	}

	function getAllText(): string {
		return extractedPages.map((p) => `--- Page ${p.pageNum} ---\n${p.text}`).join('\n\n');
	}

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(getAllText());
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			// Fallback
			const textarea = document.createElement('textarea');
			textarea.value = getAllText();
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}

	function reset() {
		fileName = '';
		extractedPages = [];
		pageCount = 0;
		charCount = 0;
		processingTime = 0;
		errorMessage = '';
		if (fileInput) fileInput.value = '';
	}

	onMount(() => {
		// Load pdf.js from CDN
		const script = document.createElement('script');
		script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
		script.type = 'module';

		// Use a regular script to load it as a global
		const loaderScript = document.createElement('script');
		loaderScript.textContent = `
			import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs').then(pdfjsLib => {
				window.pdfjsLib = pdfjsLib;
				pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
				window.dispatchEvent(new Event('pdfjsLoaded'));
			});
		`;
		loaderScript.type = 'module';
		document.head.appendChild(loaderScript);

		const onLoaded = () => {
			pdfjsLoaded = true;
		};
		window.addEventListener('pdfjsLoaded', onLoaded);

		return () => {
			window.removeEventListener('pdfjsLoaded', onLoaded);
		};
	});
</script>

<div class="demo-wrapper">
	{#if !pdfjsLoaded}
		<div class="loading-indicator">
			<div class="spinner"></div>
			<span>{$locale === 'fr' ? 'Chargement du moteur PDF...' : 'Loading PDF engine...'}</span>
		</div>
	{:else if extractedPages.length === 0}
		<!-- Drop zone -->
		<div
			class="drop-zone"
			class:dragging={isDragging}
			bind:this={dropZone}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			role="button"
			tabindex="0"
			onclick={() => fileInput.click()}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') fileInput.click();
			}}
		>
			{#if isProcessing}
				<div class="processing">
					<div class="spinner"></div>
					<p class="processing-text">
						{$locale === 'fr' ? 'Extraction du texte...' : 'Extracting text...'}
					</p>
					<p class="processing-file">{fileName}</p>
				</div>
			{:else}
				<div class="drop-content">
					<div class="drop-icon">📄</div>
					<p class="drop-title">
						{$locale === 'fr'
							? 'Glissez-déposez un fichier PDF ici'
							: 'Drag & drop a PDF file here'}
					</p>
					<p class="drop-subtitle">
						{$locale === 'fr' ? 'ou cliquez pour parcourir' : 'or click to browse'}
					</p>
					<div class="supported-badge">PDF</div>
				</div>
			{/if}
		</div>

		<input
			type="file"
			accept=".pdf"
			bind:this={fileInput}
			onchange={handleFileSelect}
			class="file-input"
		/>
	{:else}
		<!-- Results -->
		<div class="results-header">
			<div class="file-info">
				<span class="file-icon">📄</span>
				<span class="file-name">{fileName}</span>
			</div>
			<div class="results-stats">
				<div class="stat-chip">
					<span class="stat-icon">📑</span> {pageCount}
					{$locale === 'fr' ? 'pages' : 'pages'}
				</div>
				<div class="stat-chip">
					<span class="stat-icon">🔤</span> {charCount.toLocaleString()}
					{$locale === 'fr' ? 'caractères' : 'characters'}
				</div>
				<div class="stat-chip">
					<span class="stat-icon">⚡</span> {processingTime}ms
				</div>
			</div>
		</div>

		<div class="results-actions">
			<button class="action-btn copy-btn" onclick={copyToClipboard}>
				{#if copied}
					✅ {$locale === 'fr' ? 'Copié !' : 'Copied!'}
				{:else}
					📋 {$locale === 'fr' ? 'Copier le texte' : 'Copy text'}
				{/if}
			</button>
			<button class="action-btn reset-btn" onclick={reset}>
				🔄 {$locale === 'fr' ? 'Nouveau fichier' : 'New file'}
			</button>
		</div>

		<div class="pages-container">
			{#each extractedPages as page}
				<div class="page-block">
					<div class="page-header">
						<span class="page-number">Page {page.pageNum}</span>
					</div>
					<pre class="page-text">{page.text || ($locale === 'fr' ? '(Aucun texte détecté)' : '(No text detected)')}</pre>
				</div>
			{/each}
		</div>
	{/if}

	{#if errorMessage}
		<div class="error-banner">
			<span class="error-icon">⚠️</span> {errorMessage}
		</div>
	{/if}
</div>

<style>
	.demo-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	/* Loading */
	.loading-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		padding: var(--space-8);
		color: var(--color-text-muted);
		font-family: var(--font-heading);
		font-size: var(--text-base);
	}

	.spinner {
		width: 24px;
		height: 24px;
		border: 3px solid rgba(192, 192, 192, 0.2);
		border-top-color: var(--color-plate-blue);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* Drop zone */
	.drop-zone {
		border: 2px dashed rgba(192, 192, 192, 0.3);
		border-radius: var(--radius-lg);
		padding: var(--space-16) var(--space-8);
		text-align: center;
		cursor: pointer;
		transition: all var(--transition-base);
		background: rgba(0, 0, 0, 0.2);
	}

	.drop-zone:hover,
	.drop-zone.dragging {
		border-color: var(--color-plate-blue);
		background: rgba(29, 78, 216, 0.08);
		box-shadow: inset 0 0 30px rgba(29, 78, 216, 0.05);
	}

	.drop-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
	}

	.drop-icon {
		font-size: 3rem;
		filter: grayscale(0.3);
	}

	.drop-title {
		font-family: var(--font-heading);
		font-size: var(--text-xl);
		font-weight: 600;
		color: var(--color-chrome-light);
	}

	.drop-subtitle {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.supported-badge {
		display: inline-block;
		padding: var(--space-1) var(--space-3);
		font-family: var(--font-display);
		font-size: var(--text-xs);
		font-weight: 700;
		color: var(--color-plate-blue);
		background: rgba(29, 78, 216, 0.15);
		border: 1px solid rgba(29, 78, 216, 0.3);
		border-radius: var(--radius-full);
		letter-spacing: 0.1em;
	}

	.file-input {
		display: none;
	}

	/* Processing */
	.processing {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
	}

	.processing-text {
		font-family: var(--font-heading);
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-chrome-light);
	}

	.processing-file {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	/* Results header */
	.results-header {
		background: rgba(0, 0, 0, 0.4);
		border: 1px solid rgba(192, 192, 192, 0.15);
		border-radius: var(--radius-lg);
		padding: var(--space-4) var(--space-5);
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	.file-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.file-icon {
		font-size: var(--text-xl);
	}

	.file-name {
		font-family: var(--font-heading);
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-chrome-light);
	}

	.results-stats {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.stat-chip {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-3);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		background: rgba(192, 192, 192, 0.08);
		border-radius: var(--radius-full);
	}

	.stat-icon {
		font-size: var(--text-sm);
	}

	/* Actions */
	.results-actions {
		display: flex;
		gap: var(--space-3);
		justify-content: center;
	}

	.action-btn {
		padding: var(--space-2) var(--space-5);
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: var(--text-sm);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-base);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.copy-btn {
		color: var(--color-white);
		background: var(--color-plate-blue);
	}

	.copy-btn:hover {
		background: var(--color-plate-blue-light);
		box-shadow: var(--shadow-glow-blue);
	}

	.reset-btn {
		color: var(--color-chrome-light);
		background: rgba(192, 192, 192, 0.15);
		border: 1px solid rgba(192, 192, 192, 0.2);
	}

	.reset-btn:hover {
		background: rgba(192, 192, 192, 0.25);
	}

	/* Pages */
	.pages-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-height: 500px;
		overflow-y: auto;
	}

	.page-block {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(192, 192, 192, 0.1);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.page-header {
		padding: var(--space-2) var(--space-4);
		background: rgba(29, 78, 216, 0.15);
		border-bottom: 1px solid rgba(29, 78, 216, 0.2);
	}

	.page-number {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-plate-blue-light);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.page-text {
		padding: var(--space-4);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text);
		line-height: 1.7;
		white-space: pre-wrap;
		word-wrap: break-word;
		margin: 0;
		max-height: 300px;
		overflow-y: auto;
	}

	/* Error */
	.error-banner {
		padding: var(--space-3) var(--space-4);
		background: rgba(230, 57, 70, 0.15);
		border: 1px solid rgba(230, 57, 70, 0.3);
		border-radius: var(--radius-md);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-racing-red-light);
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.error-icon {
		font-size: var(--text-base);
	}

	@media (max-width: 640px) {
		.drop-zone {
			padding: var(--space-8) var(--space-4);
		}

		.results-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
