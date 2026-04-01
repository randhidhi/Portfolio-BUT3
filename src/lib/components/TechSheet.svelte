<script lang="ts">
	import { t, locale } from '../../messages/i18n';
	interface Props {
		title: string;
		subtitle: string;
		items: string[];
	}

	let { title, subtitle, items }: Props = $props();
</script>

<div class="card tech-sheet">
	<div class="sheet-header">
		<div class="sheet-logo">
			<svg viewBox="0 0 40 40" fill="none">
				<circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="2" />
				<path
					d="M20 8 L20 20 L28 28"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
				<circle cx="20" cy="20" r="4" fill="currentColor" />
			</svg>
		</div>
		<div class="sheet-title-area">
			<span class="sheet-badge">{t($locale, 'skills.hardSkills.sectionTitle')}</span>
			<h3 class="sheet-title">{title}</h3>
			<p class="sheet-subtitle">{subtitle}</p>
		</div>
	</div>

	<div class="sheet-body">
		<div class="specs-grid">
			{#each items as item, index}
				{@const [name, level] = item.split(',')}
				<div class="spec-item">
					<div class="spec-bar">
						<div class="spec-fill" style="width: {level}%"></div>
					</div>
					<span class="spec-label">{name}</span>
				</div>
			{/each}
		</div>
	</div>

	<div class="sheet-footer">
		<div class="engine-badge">
			<span class="engine-icon">⚙️</span>
			<span class="engine-text">{t($locale, 'skills.hardSkills.techStack')}</span>
		</div>
	</div>
</div>

<style>
	.card {
		background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		box-shadow: var(--shadow-lg);
		border: 1px solid rgba(192, 192, 192, 0.2);
		position: relative;
		overflow: hidden;
	}

	.tech-sheet {
		min-height: 280px;
	}

	.card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 6px;
		background: linear-gradient(
			90deg,
			var(--color-chrome-dark),
			var(--color-chrome-light),
			var(--color-chrome-dark)
		);
	}

	.sheet-header {
		display: flex;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
		padding-bottom: var(--space-4);
		border-bottom: 1px solid rgba(192, 192, 192, 0.2);
	}

	.sheet-logo {
		width: 50px;
		height: 50px;
		color: var(--color-chrome);
	}

	.sheet-logo svg {
		width: 100%;
		height: 100%;
	}

	.sheet-title-area {
		flex: 1;
	}

	.sheet-badge {
		font-family: var(--font-display);
		font-size: var(--text-xs);
		font-weight: 700;
		color: var(--color-chrome);
		letter-spacing: 0.15em;
		background: rgba(192, 192, 192, 0.1);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		display: inline-block;
		margin-bottom: var(--space-2);
	}

	.sheet-title {
		font-family: var(--font-heading);
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-chrome-light);
		margin-bottom: var(--space-1);
	}

	.sheet-subtitle {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		font-style: italic;
	}

	.sheet-body {
		flex: 1;
	}

	.specs-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.spec-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.spec-bar {
		height: 8px;
		background: rgba(192, 192, 192, 0.2);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.spec-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-racing-red), var(--color-racing-red-light));
		border-radius: var(--radius-full);
		transition: width 0.8s ease;
	}

	.spec-label {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-chrome-light);
	}

	.sheet-footer {
		margin-top: var(--space-6);
		padding-top: var(--space-4);
		border-top: 1px solid rgba(192, 192, 192, 0.2);
		display: flex;
		justify-content: flex-end;
	}

	.engine-badge {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		background: rgba(230, 57, 70, 0.1);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		border: 1px solid rgba(230, 57, 70, 0.3);
	}

	.engine-icon {
		font-size: var(--text-lg);
	}

	.engine-text {
		font-family: var(--font-display);
		font-size: var(--text-xs);
		font-weight: 700;
		color: var(--color-racing-red);
		letter-spacing: 0.1em;
	}
</style>
