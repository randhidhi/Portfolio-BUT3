<script lang="ts">
	import { t, locale } from '../../messages/i18n';
	interface Props {
		title: string;
		subtitle: string;
		items: string[];
	}

	let { title, subtitle, items }: Props = $props();
</script>

<div class="card registration-card">
	<div class="card-header">
		<div class="card-badge">{t($locale, 'skills.knowledge.sectionTitle')}</div>
		<span class="card-subtitle">{subtitle}</span>
	</div>

	<div class="card-body">
		<h3 class="card-title">{title}</h3>

		<div class="card-fields">
			{#each items as item, index}
				<div class="field">
					<span class="field-code">{String.fromCharCode(65 + index)}.</span>
					<span class="field-value">{item}</span>
				</div>
			{/each}
		</div>
	</div>

	<div class="card-footer">
		<div class="hologram"></div>
		<span class="card-id">REF: KNOW-001</span>
	</div>
</div>

<style>
	.card {
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		box-shadow: var(--shadow-lg);
		border: 1px solid rgba(0, 0, 0, 0.1);
		position: relative;
		overflow: hidden;
	}

	.registration-card {
		min-height: 280px;
	}

	.card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 6px;
		background: linear-gradient(90deg, var(--color-plate-blue), var(--color-plate-blue-light));
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-3);
		border-bottom: 1px dashed rgba(0, 0, 0, 0.2);
	}

	.card-badge {
		font-family: var(--font-display);
		font-size: var(--text-xs);
		font-weight: 700;
		color: var(--color-plate-blue);
		letter-spacing: 0.1em;
		background: rgba(29, 78, 216, 0.1);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
	}

	.card-subtitle {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		font-style: italic;
	}

	.card-body {
		flex: 1;
	}

	.card-title {
		font-family: var(--font-heading);
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-carbon);
		margin-bottom: var(--space-4);
	}

	.card-fields {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.field {
		display: flex;
		align-items: baseline;
		gap: var(--space-2);
	}

	.field-code {
		font-family: var(--font-display);
		font-size: var(--text-sm);
		font-weight: 700;
		color: var(--color-plate-blue);
		min-width: 24px;
	}

	.field-value {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-carbon);
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: var(--space-4);
		padding-top: var(--space-3);
		border-top: 1px dashed rgba(0, 0, 0, 0.2);
	}

	.hologram {
		width: 30px;
		height: 30px;
		background: linear-gradient(
			45deg,
			rgba(29, 78, 216, 0.3),
			rgba(230, 57, 70, 0.3),
			rgba(59, 130, 246, 0.3)
		);
		border-radius: var(--radius-sm);
		filter: blur(1px);
	}

	.card-id {
		font-family: var(--font-display);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		letter-spacing: 0.1em;
	}
</style>
