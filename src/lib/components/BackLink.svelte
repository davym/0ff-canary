<script lang="ts">
	import { CaretLeft, Canary } from '$lib/icons';
	import { navigateBack } from '$lib/utils';
</script>

<a href="/" on:click={navigateBack} aria-label="Navigate back">
	<CaretLeft width="1.25rem" height="1.25rem" />
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
</style>
