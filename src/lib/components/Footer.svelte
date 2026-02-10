<script lang="ts">
	import { t, locale } from '../../messages/i18n';
</script>

<footer class="footer">
	<div class="footer-container">
		<div class="footer-content">
			<h3 class="footer-title">{t($locale, 'footer.contact')}</h3>

			<div class="contact-links">
				<a href="tel:{t($locale, 'footer.phone')}" class="contact-item">
					<span class="contact-icon">📞</span>
					<span class="contact-text">{t($locale, 'footer.phone')}</span>
				</a>

				<a href="mailto:{t($locale, 'footer.email')}" class="contact-item">
					<span class="contact-icon">✉️</span>
					<span class="contact-text">{t($locale, 'footer.email')}</span>
				</a>

				<a
					href="https://{t($locale, 'footer.linkedin')}"
					target="_blank"
					rel="noopener noreferrer"
					class="contact-item"
				>
					<span class="contact-icon">💼</span>
					<span class="contact-text">LinkedIn</span>
				</a>
			</div>
		</div>

		<div class="footer-bottom">
			<div class="racing-line"></div>
			<p class="copyright">© {new Date().getFullYear()} — Portfolio BUT Informatique</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: var(--color-carbon-dark);
		border-top: 1px solid rgba(192, 192, 192, 0.1);
		padding: var(--space-12) 0 var(--space-6);
		margin-top: var(--space-20);
	}

	.footer-container {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 var(--space-6);
	}

	.footer-content {
		text-align: center;
		margin-bottom: var(--space-10);
	}

	.footer-title {
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-chrome-light);
		margin-bottom: var(--space-6);
		letter-spacing: 0.1em;
	}

	.contact-links {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--space-6);
	}

	.contact-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-5);
		background: rgba(45, 45, 45, 0.5);
		border: 1px solid rgba(192, 192, 192, 0.1);
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: all var(--transition-base);
	}

	.contact-item:hover {
		background: rgba(230, 57, 70, 0.1);
		border-color: var(--color-racing-red);
		transform: translateY(-2px);
	}

	.contact-icon {
		font-size: var(--text-xl);
	}

	.contact-text {
		font-family: var(--font-heading);
		font-size: var(--text-base);
		color: var(--color-chrome-light);
		font-weight: 500;
	}

	.footer-bottom {
		text-align: center;
	}

	.racing-line {
		height: 3px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			var(--color-racing-red) 20%,
			var(--color-racing-red) 80%,
			transparent 100%
		);
		margin-bottom: var(--space-4);
		border-radius: var(--radius-full);
	}

	.copyright {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	@media (max-width: 640px) {
		.contact-links {
			flex-direction: column;
			align-items: center;
		}

		.contact-item {
			width: 100%;
			max-width: 280px;
			justify-content: center;
		}
	}
</style>
