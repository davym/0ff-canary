<script lang="ts">
	export let isFixedSize: boolean = false;
</script>

<section class={isFixedSize ? 'fixed' : ''}>
	<slot />
</section>

<style>
	section {
		border-inline: 1px solid var(--color-border);
		display: flex;
		height: var(--grid-size);

		&:first-child {
			border-inline-start: none;
		}

		&:last-child {
			border-inline-end: none;
		}

		& > * {
			border-inline: 1px solid var(--color-border);
			display: flex;
			width: var(--grid-size);
			height: var(--grid-size);
			align-items: center;
			justify-content: center;
			color: var(--color-fg);
			background: var(--color-bg);
			transition: all 0.1s ease-out;

			&:first-child {
				border-inline-start: none;
			}

			&:last-child {
				border-inline-end: none;
			}

			&:disabled {
				color: var(--color-border);
				cursor: default;
			}

			@media (hover: hover) and (pointer: fine) {
				&:not(:disabled):hover {
					background: var(--color-fg);
					color: var(--color-bg);
				}
			}
		}
		&:not(.fixed) {
			@media (width < 768px) {
				display: contents !important;
			}
			& > * {
				@media (width < 768px) {
					flex: 1;
					width: auto;
					border: none !important;
					box-shadow: -1px 0 0 var(--color-border);
				}
			}
		}
	}
</style>
