<script lang="ts">
	import { t, locale } from '../../messages/i18n';
	import RegistrationCard from './RegistrationCard.svelte';
	import License from './License.svelte';
	import TechSheet from './TechSheet.svelte';
</script>

<div class="skills">
	<h2 class="skills-title">{t($locale, 'skills.title')}</h2>

	<div class="skills-grid">
		<div class="skill-card" style="--delay: 0ms">
			<RegistrationCard
				title={t($locale, 'skills.knowledge.title')}
				subtitle={t($locale, 'skills.knowledge.subtitle')}
				items={t($locale, 'skills.knowledge.items')}
			/>
		</div>

		<div class="skill-card" style="--delay: 150ms">
			<License
				title={t($locale, 'skills.softSkills.title')}
				subtitle={t($locale, 'skills.softSkills.subtitle')}
				items={t($locale, 'skills.softSkills.items')}
			/>
		</div>

		<div class="skill-card" style="--delay: 300ms">
			<TechSheet
				title={t($locale, 'skills.hardSkills.title')}
				subtitle={t($locale, 'skills.hardSkills.subtitle')}
				items={t($locale, 'skills.hardSkills.items')}
			/>
		</div>
	</div>
</div>

<style>
	.skills {
		padding: var(--space-8) 0;
	}

	.skills-title {
		font-family: var(--font-display);
		font-size: var(--text-3xl);
		font-weight: 700;
		color: var(--color-chrome-light);
		text-align: center;
		margin-bottom: var(--space-12);
		letter-spacing: 0.1em;
	}

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--space-8);
	}

	.skill-card {
		opacity: 0;
		animation: fadeInCard 0.6s ease forwards;
		animation-delay: var(--delay);
	}

	@keyframes fadeInCard {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 900px) {
		.skills-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
