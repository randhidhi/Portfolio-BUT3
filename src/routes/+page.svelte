<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Presentation from '$lib/components/Presentation.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import { t, locale } from '../messages/i18n';
</script>

<svelte:head>
	<title>Portfolio - BUT Informatique</title>
	<meta
		name="description"
		content="Portfolio professionnel d'un étudiant en BUT Informatique. Découvrez mes projets, compétences et parcours."
	/>
</svelte:head>

<main class="main">
	<Section id="presentation" number={t($locale, 'sections.presentation')}>
		<Presentation />
	</Section>

	<Section id="timeline" number={t($locale, 'sections.timeline')}>
		<Timeline />
	</Section>

	<Section id="projects" number={t($locale, 'sections.projects')}>
		<Projects />
	</Section>

	<Section id="skills" number={t($locale, 'sections.skills')}>
		<Skills />
	</Section>
</main>

<style>
	.main {
		padding-top: 80px; /* Account for fixed header */
	}
</style>
