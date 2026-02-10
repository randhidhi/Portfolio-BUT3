<script lang="ts">
	import { t, locale } from '../../messages/i18n';
	import LicensePlate from './LicensePlate.svelte';

	const projects = ['project1', 'project2', 'project3'] as const;
</script>

<div class="projects">
	<h2 class="projects-title">{t($locale, 'projects.title')}</h2>

	<div class="projects-grid">
		{#each projects as project, index}
			<div class="project-item" style="--delay: {index * 150}ms">
				<LicensePlate
					title={t($locale, `projects.${project}.title`)}
					date={t($locale, `projects.${project}.date`)}
					description={t($locale, `projects.${project}.description`)}
					slug={project}
				/>
			</div>
		{/each}
	</div>
</div>

<style>
	.projects {
		padding: var(--space-8) 0;
	}

	.projects-title {
		font-family: var(--font-display);
		font-size: var(--text-3xl);
		font-weight: 700;
		color: var(--color-chrome-light);
		text-align: center;
		margin-bottom: var(--space-12);
		letter-spacing: 0.1em;
	}

	.projects-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}

	.project-item {
		opacity: 0;
		animation: slideInPlate 0.6s ease forwards;
		animation-delay: var(--delay);
	}

	@keyframes slideInPlate {
		from {
			opacity: 0;
			transform: translateX(-30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
