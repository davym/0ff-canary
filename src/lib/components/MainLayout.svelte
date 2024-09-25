<script lang="ts">
	import { page } from '$app/stores';
	import { ButtonSection } from '$lib/components';
	import { navigateBack } from '$lib/utils';
	import { CaretLeft } from '$lib/icons';
</script>

<div class="site">
	<header>
		{#if $page.url.pathname !== '/'}
			<ButtonSection isFixedSize={true}>
				<a href="/" on:click={navigateBack} aria-label="Navigate back">
					<CaretLeft height="37.5%" />
				</a>
			</ButtonSection>
		{/if}
		<slot name="header">
			<ButtonSection isFixedSize={true}></ButtonSection>
		</slot>
	</header>
	<main>
		<slot />
	</main>
</div>

<style>
	.site {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		transition: all 0.3s var(--ease-out-expo);

		@media (width > 768px) {
			transition-property: opacity, margin-inline-start;
		}

		& header {
			padding-inline-start: calc(var(--grid-size) - 1px);
			transition: padding-inline-start 0.3s var(--ease-out-expo);
		}
	}
	:global(.sb.sb--active + .site) {
		opacity: 0.5;
		pointer-events: none;

		@media (width > 768px) {
			margin-inline-start: var(--width-sidebar);
			transform: none;
			opacity: 1;
			filter: none;
			pointer-events: unset;
		}
		& header {
			padding-inline-start: 0;
		}
	}
</style>
