<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		id: string;
		number: string;
		children: import('svelte').Snippet;
	}

	let { id, number, children }: Props = $props();

	let sectionRef: HTMLElement;
	let isVisible = $state(false);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (sectionRef) {
			observer.observe(sectionRef);
		}

		return () => observer.disconnect();
	});
</script>

<section {id} class="section" class:visible={isVisible} bind:this={sectionRef}>
	<span class="section-number">{number}</span>
	<div class="section-content">
		{@render children()}
	</div>
</section>

<style>
	.section {
		position: relative;
		min-height: 100vh;
		padding: var(--space-24) 0;
		opacity: 0;
		transform: translateY(30px);
		transition:
			opacity 0.8s ease,
			transform 0.8s ease;
	}

	.section.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.section-number {
		font-family: var(--font-display);
		font-size: clamp(6rem, 15vw, 12rem);
		font-weight: 900;
		color: transparent;
		-webkit-text-stroke: 2px rgba(192, 192, 192, 0.15);
		position: absolute;
		top: var(--space-12);
		left: var(--space-4);
		z-index: 0;
		user-select: none;
		pointer-events: none;
		line-height: 1;
	}

	.section-content {
		position: relative;
		z-index: 1;
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 var(--space-6);
	}

	@media (max-width: 768px) {
		.section {
			padding: var(--space-16) 0;
		}

		.section-number {
			top: var(--space-8);
			left: var(--space-2);
		}
	}
</style>
