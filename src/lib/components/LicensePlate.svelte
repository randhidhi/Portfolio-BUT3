<script lang="ts">
	import { t, locale } from '../../messages/i18n';

	interface Props {
		title: string;
		date: string;
		description: string;
		slug: string;
	}

	let { title, date, description, slug }: Props = $props();
</script>

<article class="license-plate">
	<div class="plate-blue">
		<div class="plate-blue-content">
			<span class="plate-title">{title}</span>
			<span class="plate-date">{date}</span>
		</div>
		<div class="plate-stars">★★★</div>
	</div>

	<div class="plate-white">
		<p class="plate-description">{description}</p>
		<a href="/projects/{slug}" class="plate-btn">
			{t($locale, 'projects.viewProject')}
			<svg
				class="arrow-icon"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<line x1="5" y1="12" x2="19" y2="12"></line>
				<polyline points="12 5 19 12 12 19"></polyline>
			</svg>
		</a>
	</div>

	<div class="plate-blue plate-blue-right">
		<div class="plate-code">FR</div>
	</div>
</article>

<style>
	.license-plate {
		display: grid;
		grid-template-columns: 100px 1fr 60px;
		background: var(--color-off-white);
		border: 4px solid var(--color-carbon);
		border-radius: var(--radius-md);
		overflow: hidden;
		box-shadow:
			var(--shadow-lg),
			inset 0 0 0 2px rgba(0, 0, 0, 0.1);
		transition: all var(--transition-base);
	}

	.license-plate:hover {
		transform: translateY(-4px);
		box-shadow:
			var(--shadow-xl),
			0 0 30px rgba(29, 78, 216, 0.2);
	}

	.plate-blue {
		background: linear-gradient(
			180deg,
			var(--color-plate-blue) 0%,
			var(--color-plate-blue-dark) 100%
		);
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}

	.plate-blue-right {
		justify-content: center;
	}

	.plate-blue-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		text-align: center;
	}

	.plate-title {
		font-family: var(--font-display);
		font-size: var(--text-xs);
		font-weight: 700;
		color: var(--color-white);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		line-height: 1.2;
	}

	.plate-date {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		color: rgba(255, 255, 255, 0.8);
	}

	.plate-stars {
		font-size: var(--text-xs);
		color: var(--color-warning-orange);
		letter-spacing: 2px;
	}

	.plate-white {
		background: var(--color-off-white);
		padding: var(--space-6);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--space-4);
	}

	.plate-description {
		font-family: var(--font-body);
		font-size: var(--text-base);
		color: var(--color-carbon);
		line-height: 1.6;
	}

	.plate-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-plate-blue);
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		transition: all var(--transition-base);
	}

	.plate-btn:hover {
		color: var(--color-racing-red);
	}

	.arrow-icon {
		width: 18px;
		height: 18px;
		transition: transform var(--transition-base);
	}

	.plate-btn:hover .arrow-icon {
		transform: translateX(4px);
	}

	.plate-code {
		font-family: var(--font-display);
		font-size: var(--text-lg);
		font-weight: 900;
		color: var(--color-white);
		text-align: center;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.license-plate {
			grid-template-columns: 1fr;
		}

		.plate-blue {
			padding: var(--space-3);
			flex-direction: row;
			justify-content: space-between;
		}

		.plate-blue-right {
			display: none;
		}

		.plate-blue-content {
			flex-direction: row;
			align-items: center;
			gap: var(--space-3);
		}
	}
</style>
