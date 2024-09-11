<script lang="ts">
	import { ArrowLeft, Canary } from '$lib/icons';
</script>

<a href="/" aria-label="Back to releases">
	<span class="mobile">
		<Canary width="1.5rem" />
	</span>
	<span class="desktop">
		<ArrowLeft width="1.25rem" height="1.25rem" />
	</span>
</a>

<style>
	a {
		position: sticky;
		left: 0;
		background: var(--color-bg);
		color: var(--color-fg);
		z-index: 100;

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				background: var(--color-fg);
				color: var(--color-bg);
			}
		}
	}
	.mobile {
		display: block;

		@media (width > 768px) {
			display: none;
		}
	}
	.desktop {
		display: none;

		@media (width > 768px) {
			display: block;
		}
	}
</style>
