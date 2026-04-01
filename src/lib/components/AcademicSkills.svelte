<script lang="ts">
	import { t, locale } from '../../messages/i18n';
    const skills = [
		{
			key: 'skill1',
			color: 'red',
			subKeys: ['sub1', 'sub2', 'sub3'],
			icon: '⚙'
		},
		{
			key: 'skill2',
			color: 'orange',
			subKeys: ['sub1', 'sub2', 'sub3'],
			icon: '◉'
		},
		{
			key: 'skill3',
			color: 'black',
			subKeys: ['sub1', 'sub2', 'sub3', 'sub4'],
			icon: '✦'
		}
	] as const;
</script>

<div class="academic-skills">
	<h2 class="section-title">{t($locale, 'academicSkills.title')}</h2>

	<div class="skills-grid">
		{#each skills as skill, i}
			<article class="skill-card skill-card--{skill.color}" style="--delay: {i * 150}ms">
				<div class="skill-left">
					<span class="skill-icon" aria-hidden="true">{skill.icon}</span>
					<h3 class="skill-name">{t($locale, `academicSkills.${skill.key}.name`)}</h3>
					<p class="skill-desc">{t($locale, `academicSkills.${skill.key}.description`)}</p>
				</div>
				<ul class="skill-subs">
					{#each skill.subKeys as subKey}
						<li class="skill-sub">
							<span class="sub-bullet" aria-hidden="true"></span>
							<span class="sub-text">{t($locale, `academicSkills.${skill.key}.${subKey}`)}</span>
						</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>
</div>

<style>
	.academic-skills {
		padding: var(--space-8) 0;
	}

	.section-title {
		font-family: var(--font-display);
		font-size: var(--text-3xl);
		font-weight: 700;
		color: var(--color-chrome-light);
		text-align: center;
		margin-bottom: var(--space-12);
		letter-spacing: 0.1em;
	}

	.skills-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.skill-card {
		display: grid;
		grid-template-columns: 240px 1fr;
		border-radius: var(--radius-md);
		overflow: hidden;
		box-shadow: var(--shadow-lg);
		opacity: 0;
		animation: slideInCard 0.6s ease forwards;
		animation-delay: var(--delay);
		transition: transform var(--transition-base), box-shadow var(--transition-base);
	}

	.skill-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-xl);
	}

	.skill-left {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: var(--space-3);
		padding: var(--space-8) var(--space-6);
	}

	.skill-card--red .skill-left {
		background: linear-gradient(
			135deg,
			var(--color-racing-red-dark) 0%,
			var(--color-racing-red) 100%
		);
	}
	.skill-card--red .skill-subs {
		border-left: 4px solid var(--color-racing-red);
	}
	.skill-card--red .sub-bullet {
		background: var(--color-racing-red);
	}
	.skill-card--red:hover .skill-name {
		text-shadow: 0 0 20px rgba(255, 77, 90, 0.4);
	}

	.skill-card--orange .skill-left {
		background: linear-gradient(135deg, #7c3a00 0%, #b85a00 100%);
	}
	.skill-card--orange .skill-subs {
		border-left: 4px solid #c96a00;
	}
	.skill-card--orange .sub-bullet {
		background: #c96a00;
	}
	.skill-card--orange:hover .skill-name {
		text-shadow: 0 0 20px rgba(201, 106, 0, 0.4);
	}

	.skill-card--black .skill-left {
		background: linear-gradient(135deg, #0a0a0a 0%, var(--color-carbon-light) 100%);
		border-right: 1px solid rgba(192, 192, 192, 0.15);
	}
	.skill-card--black .skill-subs {
		border-left: 4px solid var(--color-chrome-dark);
	}
	.skill-card--black .sub-bullet {
		background: var(--color-chrome);
	}
	.skill-card--black:hover .skill-name {
		text-shadow: 0 0 20px rgba(192, 192, 192, 0.4);
	}

	.skill-icon {
		font-size: var(--text-2xl);
		line-height: 1;
	}

	.skill-name {
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-white);
		letter-spacing: 0.05em;
		line-height: 1.1;
		transition: text-shadow var(--transition-base);
	}

	.skill-desc {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: rgba(255, 255, 255, 0.75);
		line-height: 1.5;
	}

	.skill-subs {
		list-style: none;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: var(--space-4);
		padding: var(--space-8) var(--space-8);
		background: rgba(45, 45, 45, 0.6);
		backdrop-filter: blur(4px);
	}

	.skill-sub {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
	}

	.sub-bullet {
		flex-shrink: 0;
		width: 8px;
		height: 8px;
		border-radius: var(--radius-full);
		margin-top: 6px;
	}

	.sub-text {
		font-family: var(--font-heading);
		font-size: var(--text-base);
		color: var(--color-chrome-light);
		line-height: 1.5;
		font-weight: 500;
	}

	@keyframes slideInCard {
		from {
			opacity: 0;
			transform: translateX(-30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@media (max-width: 900px) {
		.skill-card {
			grid-template-columns: 200px 1fr;
		}

		.skill-name {
			font-size: var(--text-xl);
		}

		.skill-subs {
			padding: var(--space-6);
			gap: var(--space-3);
		}
	}

	@media (max-width: 640px) {
		.skill-card {
			grid-template-columns: 1fr;
		}

		.skill-left {
			padding: var(--space-5) var(--space-5);
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			gap: var(--space-3);
		}

		.skill-icon {
			font-size: var(--text-xl);
		}

		.skill-desc {
			width: 100%;
		}

		.skill-subs {
			border-left: none;
			border-top: 4px solid;
			padding: var(--space-5);
		}

		.skill-card--red .skill-subs {
			border-top-color: var(--color-racing-red);
		}
		.skill-card--orange .skill-subs {
			border-top-color: #c96a00;
		}
		.skill-card--black .skill-subs {
			border-top-color: var(--color-chrome-dark);
		}

		.sub-text {
			font-size: var(--text-sm);
		}
	}
</style>
