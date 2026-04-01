<script lang="ts">
	import { t, locale } from '../../messages/i18n';
	interface Props {
		title: string;
		subtitle: string;
		items: string[];
	}

	let { title, subtitle, items }: Props = $props();
</script>

<div class="card license-card">
	<div class="license-photo">
		<div class="photo-placeholder-small">
			<span>ID</span>
		</div>
	</div>

	<div class="license-content">
		<div class="license-header">
			<span class="license-type">{t($locale, 'skills.softSkills.sectionTitle')}</span>
			<span class="license-country">{t($locale, 'skills.softSkills.language')}</span>
		</div>

		<h3 class="license-title">{title}</h3>
		<p class="license-subtitle">{subtitle}</p>

		<div class="license-categories">
			{#each items as item, index}
				<span class="category">
					<span class="cat-letter">{String.fromCharCode(65 + index)}</span>
					{item}
				</span>
			{/each}
		</div>
	</div>
</div>

<style>
	.card {
		background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		box-shadow: var(--shadow-lg);
		border: 1px solid rgba(230, 57, 70, 0.2);
		position: relative;
		overflow: hidden;
	}

	.license-card {
		display: grid;
		grid-template-columns: 80px 1fr;
		gap: var(--space-4);
		min-height: 280px;
	}

	.card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 6px;
		background: linear-gradient(90deg, var(--color-racing-red), var(--color-racing-red-light));
	}

	.license-photo {
		display: flex;
		align-items: flex-start;
	}

	.photo-placeholder-small {
		width: 70px;
		height: 90px;
		background: linear-gradient(135deg, #ddd 0%, #ccc 100%);
		border: 1px solid rgba(0, 0, 0, 0.2);
		border-radius: var(--radius-sm);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-display);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.license-content {
		display: flex;
		flex-direction: column;
	}

	.license-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
	}

	.license-type {
		font-family: var(--font-display);
		font-size: var(--text-xs);
		font-weight: 700;
		color: var(--color-racing-red);
		letter-spacing: 0.1em;
	}

	.license-country {
		font-family: var(--font-display);
		font-size: var(--text-sm);
		font-weight: 900;
		color: var(--color-racing-red);
		background: rgba(230, 57, 70, 0.1);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
	}

	.license-title {
		font-family: var(--font-heading);
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-carbon);
		margin-bottom: var(--space-1);
	}

	.license-subtitle {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		font-style: italic;
		margin-bottom: var(--space-4);
	}

	.license-categories {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.category {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-family: var(--font-body);
		font-size: var(--text-xs);
		color: var(--color-carbon);
		background: rgba(255, 255, 255, 0.8);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.cat-letter {
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--color-racing-red);
	}
</style>
