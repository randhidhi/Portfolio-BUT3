<script lang="ts">
	import { t, locale } from '../../messages/i18n';
	import { base } from '$app/paths';
</script>

<div class="presentation">
	<div class="presentation-content">
		<div class="presentation-text">
			<h1 class="name">{t($locale, 'presentation.name')}</h1>
			<p class="status">{t($locale, 'presentation.status')}</p>
			<p class="tagline">{t($locale, 'presentation.tagline')}</p>

			<a href="{base}/documents/CV.pdf" download class="btn btn-primary cv-btn">
				<svg class="cv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
					<polyline points="7,10 12,15 17,10" />
					<line x1="12" y1="15" x2="12" y2="3" />
				</svg>
				{t($locale, 'presentation.downloadCV')}
			</a>
		</div>
	</div>

	<!-- Decorative racing elements -->
	<div class="racing-elements">
		<div class="speed-lines">
			{#each Array(5) as _, i}
				<div class="speed-line" style="--delay: {i * 0.1}s"></div>
			{/each}
		</div>
	</div>
</div>

<style>
	.presentation {
		min-height: calc(100vh - 80px);
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;
	}

	.presentation-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-12);
		width: 100%;
	}

	.presentation-text {
		flex: 1;
		max-width: 600px;
	}

	.name {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 900;
		color: var(--color-white);
		letter-spacing: 0.05em;
		line-height: 1.1;
		margin-bottom: var(--space-4);
		background: linear-gradient(135deg, var(--color-white) 0%, var(--color-chrome) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.status {
		font-family: var(--font-heading);
		font-size: var(--text-xl);
		font-weight: 600;
		color: var(--color-racing-red);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: var(--space-4);
	}

	.tagline {
		font-size: var(--text-lg);
		color: var(--color-text-muted);
		line-height: 1.7;
		margin-bottom: var(--space-8);
	}

	.cv-btn {
		font-size: var(--text-base);
	}

	.cv-icon {
		width: 20px;
		height: 20px;
	}

	/* Racing decoration */
	.racing-elements {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 30%;
		height: 100%;
		pointer-events: none;
		opacity: 0.1;
		overflow: hidden;
	}

	.speed-lines {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		width: 100%;
	}

	.speed-line {
		position: absolute;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--color-racing-red));
		animation: speedLine 2s ease-in-out infinite;
		animation-delay: var(--delay);
	}

	.speed-line:nth-child(1) {
		top: 20%;
		width: 60%;
	}
	.speed-line:nth-child(2) {
		top: 35%;
		width: 80%;
	}
	.speed-line:nth-child(3) {
		top: 50%;
		width: 100%;
	}
	.speed-line:nth-child(4) {
		top: 65%;
		width: 70%;
	}
	.speed-line:nth-child(5) {
		top: 80%;
		width: 50%;
	}

	@keyframes speedLine {
		0%,
		100% {
			opacity: 0.3;
			transform: scaleX(1);
		}
		50% {
			opacity: 1;
			transform: scaleX(1.1);
		}
	}

	/* Responsive */
	@media (max-width: 900px) {
		.presentation-content {
			flex-direction: column-reverse;
			text-align: center;
		}

		.presentation-text {
			max-width: 100%;
		}

		.racing-elements {
			display: none;
		}
	}
</style>
