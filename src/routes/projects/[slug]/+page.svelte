<script lang="ts">
	import { page } from '$app/stores';
	import { t, locale } from '../../../messages/i18n';

	const slug = $derived($page.params.slug);

	// Map slug to project key
	const projectKey = $derived(slug as 'project1' | 'project2' | 'project3');
</script>

<svelte:head>
	<title>{t($locale, `projects.${projectKey}.title`)} - Portfolio</title>
</svelte:head>

<main class="project-page">
	<div class="project-container">
		<a href="/#projects" class="back-link">
			<svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="19" y1="12" x2="5" y2="12"></line>
				<polyline points="12 19 5 12 12 5"></polyline>
			</svg>
			Retour aux projets
		</a>

		<header class="project-header">
			<div class="project-plate">
				<div class="plate-strip"></div>
				<h1 class="project-title">{t($locale, `projects.${projectKey}.title`)}</h1>
				<span class="project-date">{t($locale, `projects.${projectKey}.date`)}</span>
			</div>
		</header>

		<article class="project-content">
			<section class="project-section">
				<h2 class="section-title">Description</h2>
				<p class="project-description">{t($locale, `projects.${projectKey}.description`)}</p>
				<p class="placeholder-text">
					[Placeholder: Ajouter une description détaillée du projet ici. Inclure le contexte, les
					objectifs, les défis rencontrés et les solutions apportées.]
				</p>
			</section>

			<section class="project-section">
				<h2 class="section-title">Technologies</h2>
				<div class="tech-tags">
					<span class="tech-tag">Technology 1</span>
					<span class="tech-tag">Technology 2</span>
					<span class="tech-tag">Technology 3</span>
				</div>
			</section>

			<section class="project-section">
				<h2 class="section-title">Équipe</h2>
				<div class="team-list">
					<div class="team-member">
						<div class="member-avatar">👤</div>
						<span class="member-name">Membre 1</span>
					</div>
					<div class="team-member">
						<div class="member-avatar">👤</div>
						<span class="member-name">Membre 2</span>
					</div>
				</div>
			</section>

			<section class="project-section">
				<h2 class="section-title">Démonstration</h2>
				<div class="demo-placeholder">
					<div class="demo-icon">🚀</div>
					<p class="demo-text">Zone de simulation / démonstration du projet</p>
					<p class="demo-subtext">[À implémenter avec script JS converti]</p>
				</div>
			</section>
		</article>
	</div>
</main>

<style>
	.project-page {
		padding-top: 100px;
		min-height: 100vh;
	}

	.project-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 0 var(--space-6) var(--space-16);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-family: var(--font-heading);
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-chrome);
		text-decoration: none;
		margin-bottom: var(--space-8);
		transition: all var(--transition-base);
	}

	.back-link:hover {
		color: var(--color-racing-red);
	}

	.back-icon {
		width: 20px;
		height: 20px;
		transition: transform var(--transition-base);
	}

	.back-link:hover .back-icon {
		transform: translateX(-4px);
	}

	.project-header {
		margin-bottom: var(--space-12);
	}

	.project-plate {
		background: var(--color-off-white);
		border: 4px solid var(--color-carbon);
		border-radius: var(--radius-md);
		padding: var(--space-6);
		position: relative;
		overflow: hidden;
	}

	.plate-strip {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 8px;
		background: linear-gradient(
			180deg,
			var(--color-plate-blue) 0%,
			var(--color-plate-blue-dark) 100%
		);
	}

	.project-title {
		font-family: var(--font-display);
		font-size: var(--text-4xl);
		font-weight: 900;
		color: var(--color-carbon);
		letter-spacing: 0.05em;
		margin-left: var(--space-4);
	}

	.project-date {
		font-family: var(--font-heading);
		font-size: var(--text-lg);
		color: var(--color-plate-blue);
		margin-left: var(--space-4);
	}

	.project-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-10);
	}

	.project-section {
		background: rgba(45, 45, 45, 0.3);
		border: 1px solid rgba(192, 192, 192, 0.1);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
	}

	.section-title {
		font-family: var(--font-heading);
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-racing-red);
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-2);
		border-bottom: 2px solid var(--color-racing-red);
	}

	.project-description {
		font-size: var(--text-lg);
		color: var(--color-text);
		line-height: 1.8;
		margin-bottom: var(--space-4);
	}

	.placeholder-text {
		font-size: var(--text-base);
		color: var(--color-text-muted);
		font-style: italic;
		background: rgba(0, 0, 0, 0.2);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		border-left: 4px solid var(--color-warning-orange);
	}

	.tech-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	.tech-tag {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-white);
		background: var(--color-plate-blue);
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-full);
	}

	.team-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
	}

	.team-member {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		background: rgba(0, 0, 0, 0.2);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
	}

	.member-avatar {
		font-size: var(--text-2xl);
	}

	.member-name {
		font-family: var(--font-heading);
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-chrome-light);
	}

	.demo-placeholder {
		background: rgba(0, 0, 0, 0.3);
		border: 2px dashed var(--color-chrome-dark);
		border-radius: var(--radius-lg);
		padding: var(--space-12);
		text-align: center;
	}

	.demo-icon {
		font-size: var(--text-5xl);
		margin-bottom: var(--space-4);
	}

	.demo-text {
		font-family: var(--font-heading);
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-chrome);
		margin-bottom: var(--space-2);
	}

	.demo-subtext {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		font-style: italic;
	}
</style>
