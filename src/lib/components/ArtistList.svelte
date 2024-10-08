<script lang="ts">
	import type { Artist } from '$lib/types';
	import { artistsStore, loadingStore, filtersStore, albumPaginationStore } from '$lib/stores';
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
				<a href={`/artist/${id}`} class="name">
					{name}
				</a>
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
					aria-label={`Delete ${name} and releases`}
				>
					-
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
		display: flex;
		flex-direction: column;
		gap: 1px;

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
		text-decoration: none;
		color: inherit;

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
		overflow: hidden;

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
				width: 1.75rem;
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
		font-size: 1rem;
		text-transform: uppercase;
		text-overflow: clip;
		padding: 0;
		transition: transform 0.3s var(--ease-out-expo);
		font-weight: 700;
		text-align: center;
		width: 1.75rem;

		@media (hover: hover) and (pointer: fine) {
			padding-inline: 0;
			width: 0;
			transform: translateX(100%);
			background: var(--color-negative);
		}

		@media (hover: none) and (pointer: coarse) {
			opacity: 0.5;
		}
	}
</style>
