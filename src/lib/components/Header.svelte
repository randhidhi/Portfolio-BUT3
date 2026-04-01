<script lang="ts">
	import { base } from '$app/paths';
	import { setLocale, locale, t } from '../../messages/i18n';
</script>

<header class="header">
	<div class="header-container">
		<a class="logo-btn" href="{base}" aria-label={t($locale, 'header.home')}>
			<span class="logo-text">{t($locale, 'header.title').toUpperCase()}</span>
			<span class="logo-accent">.</span>
		</a>

		<nav class="header-nav">
			<button
				class="lang-switch"
				onclick={() => setLocale($locale === 'fr' ? 'en' : 'fr')}
				aria-label="Change language"
			>
				<span class="lang-flag">{$locale === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
				<span class="lang-text">{t($locale, 'header.language')}</span>
			</button>
		</nav>
	</div>
</header>

<style>
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: rgba(26, 26, 26, 0.85);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(192, 192, 192, 0.1);
	}

	.header-container {
		max-width: 1280px;
		margin: 0 auto;
		padding: var(--space-4) var(--space-6);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo-btn {
		background: none;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: baseline;
		gap: 0;
		transition: transform var(--transition-base);
	}

	.logo-btn:hover {
		transform: scale(1.02);
	}

	.logo-text {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-chrome-light);
		letter-spacing: 0.1em;
	}

	.logo-accent {
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		font-weight: 900;
		color: var(--color-racing-red);
	}

	.header-nav {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.lang-switch {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		background: rgba(45, 45, 45, 0.6);
		border: 1px solid rgba(192, 192, 192, 0.2);
		border-radius: var(--radius-full);
		padding: var(--space-2) var(--space-4);
		cursor: pointer;
		transition: all var(--transition-base);
	}

	.lang-switch:hover {
		background: rgba(192, 192, 192, 0.1);
		border-color: var(--color-racing-red);
	}

	.lang-flag {
		font-size: var(--text-lg);
	}

	.lang-text {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-chrome-light);
		letter-spacing: 0.05em;
	}

	@media (max-width: 640px) {
		.header-container {
			padding: var(--space-3) var(--space-4);
		}

		.logo-text {
			font-size: var(--text-lg);
		}

		.lang-text {
			display: none;
		}
	}
</style>
