<script lang="ts">
	import { artistsStore } from '$lib/stores/artistsStore';
	import { ArtistList, ArtistSearch } from '$lib/components';
	import { Gear, Info, Hash, Menu, Close, Canary } from '$lib/icons';
	import { sideBarStore } from '$lib/stores/sideBarStore';
</script>

<header class={$sideBarStore ? 'active' : ''}>
	<button
		aria-label="{$sideBarStore ? 'Close' : 'Open'} Menu"
		on:click={() => sideBarStore.set(!$sideBarStore)}
	>
		{#if !$sideBarStore}
			<Menu width="62.5%" height="62.5%" />
		{:else}
			<Close width="62.5%" height="62.5%" />
		{/if}
	</button>
	<h1>
		<a href="/">
			<Canary width="1.5rem" />
			<span>CANARY</span>
		</a>
	</h1>

	<section>
		<ArtistSearch />
	</section>
	<section class="list">
		<ArtistList artists={$artistsStore} />
	</section>
	<section class="utils">
		<a href="/settings" aria-label="Settings">
			<Gear width="1.125rem" height="1.125rem" />
		</a>
		<a href="/about" aria-label="About CANARY">
			<Info width="1.125rem" height="1.125rem" />
		</a>
		<a href="#">
			<Hash width="1.125rem" height="1.125rem" />
		</a>
	</section>
</header>

<style>
	@keyframes -global-colorCycle {
		0% {
			color: var(--color-accent-primary);
			filter: drop-shadow(0 0 1em currentColor);
		}
		16.5% {
			color: var(--color-medium);
		}
		33% {
			color: var(--color-accent-secondary);
			filter: drop-shadow(0 0 1em currentColor);
		}
		49.5% {
			color: var(--color-medium);
		}
		66% {
			color: var(--color-accent-tertiary);
			filter: drop-shadow(0 0 1em currentColor);
		}
		83% {
			color: var(--color-medium);
		}
		100% {
			color: var(--color-accent-primary);
			filter: drop-shadow(0 0 1em currentColor);
		}
	}

	h1 {
		font-size: inherit;
		height: var(--grid-size);
		line-height: 1;
		border-block-end: 1px solid var(--color-border);

		& a {
			padding-inline: 1rem;
			text-decoration: none;
			color: inherit;
			display: flex;
			align-items: center;
			gap: 0.5rem;
			height: 100%;
			transition:
				color 0.2s ease-out,
				filter 0.2s ease-out;

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					color: var(--color-accent-primary);
					animation: colorCycle 3s ease-in-out infinite 3s;
				}
			}
		}

		& svg {
			margin-top: -0.125rem;
		}
	}
	section {
		&:not(:first-of-type) {
			border-block-start: 1px solid var(--color-border);
		}
	}
	header {
		position: fixed;
		left: 0;
		top: 0;
		width: 270px;
		height: 100%;
		display: flex;
		flex-direction: column;
		transform: translateX(-100%);
		z-index: 999;
		transition: all 0.3s var(--ease-out-expo);
		background: var(--color-bg);
		border-inline-end: 1px solid var(--color-border);

		&.active {
			transform: translateX(0);
			box-shadow: 0 0 7rem 3.5rem var(--color-bg);
		}

		@media (min-width: 768px) {
			transition: none;
			transform: translateX(0);
			box-shadow: none !important;
			width: var(--width-sidebar);
			z-index: 3;
		}
	}
	button {
		position: absolute;
		top: 0;
		left: 100%;
		background: var(--color-bg);
		border: none;
		line-height: 1;
		font-size: 1.25rem;
		cursor: pointer;
		width: var(--grid-size);
		height: var(--grid-size);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-fg);
		transition: all 0.3s var(--ease-out-expo);
		border-inline-end: 1px solid var(--color-border);
		border-block-end: 1px solid var(--color-border);
		z-index: 10;

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				background-color: var(--color-fg);
				color: var(--color-bg);
			}
		}

		@media (min-width: 768px) {
			display: none;
		}
	}

	.active button {
		transform: translateX(-100%);
		border-inline-start: 1px solid var(--color-border);
		border-inline-end: none;
	}

	.list {
		flex: 1;
		overflow: auto;
	}
	.utils {
		height: var(--grid-size);
		display: flex;

		& > a {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			color: var(--color-muted);
			text-decoration: none;
			font-weight: 700;

			transition: all 0.1s ease-out;

			&:not(:last-child) {
				border-inline-end: 1px solid var(--color-border);
			}

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					background-color: var(--color-fg);
					color: var(--color-bg);
				}
			}
		}
	}
</style>
