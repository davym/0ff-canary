<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import type { Artist } from '$lib/types';
	import {
		artistsStore,
		loadingStore,
		filtersStore,
		albumPaginationStore,
		sideBarStore
	} from '$lib/stores';
	import { sortArtistsByName, groupArtistsByName } from '$lib/utils';

	export let artists: Artist[];

	$: sortedArtists = sortArtistsByName(artists);
	$: groupedArtists = groupArtistsByName(sortedArtists);
</script>

<ul class={$loadingStore.isActive ? 'disabled' : ''}>
	{#each Object.keys(groupedArtists) as key}
		<li class="index">
			{key.toUpperCase()}
		</li>
		{#each groupedArtists[key] as { id, name }}
			<li>
				<button
					class="name {$filtersStore.artist === id ? 'selected' : ''}"
					type="button"
					on:click={() => {
						filtersStore.update((state) => ({ ...state, artist: state.artist === id ? '' : id }));
						albumPaginationStore.goToPage(1);
						sideBarStore.set(false);
						if ($page.url.pathname !== '/') {
							goto('/');
						}
					}}
					aria-label={$filtersStore.artist === id
						? `Remove filter for ${name}`
						: `Filter releases by ${name}`}
				>
					{name}
				</button>
				<button
					class="delete"
					type="button"
					on:click={() => {
						artistsStore.remove(id);
						if (id === $filtersStore.artist) {
							filtersStore.update((state) => ({ ...state, artist: '' }));
						}
						albumPaginationStore.goToPage(1);
					}}
					aria-label={`Delete ${name} from artist catalog`}
				>
					Delete
				</button>
			</li>
		{/each}
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		font-size: 0.8125rem;
		padding-block: 0.5rem;
		transition: opacity 0.1s ease-out;

		&.disabled {
			pointer-events: none;
			opacity: 0.3;
		}
	}
	.name {
		overflow: hidden;
		text-overflow: ellipsis;
		padding-inline: 1rem;
		flex: 1;

		&.selected {
			color: var(--color-accent-primary);
		}
	}
	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		white-space: nowrap;
		color: var(--color-fg);
		gap: 0.5em;
		line-height: 1.75rem;

		&.index {
			position: sticky;
			background: var(--color-bg);
			color: var(--color-medium);
			top: 0;
			font-weight: 700;
			padding-inline: 1rem;
			font-size: 0.625rem;
			line-height: 1.2rem;
			z-index: 1;
		}

		@media (hover: hover) and (pointer: fine) {
			&:not(.index):hover {
				background: var(--color-faded);
			}
			&:focus-visible .delete,
			&:hover .delete {
				width: auto;
				padding-inline: 1em;
				transform: translateX(0);
			}
		}
	}
	.delete {
		background: var(--color-border);
		overflow: hidden;
		border: none;
		cursor: pointer;
		flex-shrink: 0;
		color: var(--color-fg);
		font-size: 0.625rem;
		text-transform: uppercase;
		text-overflow: clip;
		padding-inline: 1em;
		transition: transform 0.3s var(--ease-out-expo);
		font-weight: 700;

		@media (hover: hover) and (pointer: fine) {
			padding-inline: 0;
			width: 0;
			transform: translateX(100%);
			background: red;
		}

		@media (hover: none) and (pointer: coarse) {
			opacity: 0.5;
		}
	}
</style>
