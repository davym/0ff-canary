<header>
	<slot />
</header>

<style>
	header {
		display: flex;
		align-items: center;
		font-size: 0.75rem;
		position: fixed;
		left: 0;
		width: 100%;
		background: var(--color-bg-translucent);
		border-block-end: 1px solid var(--color-border);
		top: 0;
		line-height: 1rem;
		padding: 0 0 0 calc(var(--grid-size) - 1px);
		z-index: 98;
		height: var(--grid-size);
		overflow-x: auto;

		@media (min-width: 768px) {
			left: var(--width-sidebar);
			width: calc(100% - var(--width-sidebar));
			padding-inline-start: 0;
		}

		& > * {
			min-width: var(--grid-size);
			display: flex;
			flex-direction: column;
			height: 100%;
			justify-content: center;
			align-items: center;
			border-inline-end: 1px solid var(--color-border);
			color: inherit;
		}
	}
</style>
