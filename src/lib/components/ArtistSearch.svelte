<script lang="ts">
	import { slide } from 'svelte/transition';
	import { searchTerm, searchResults } from '$lib/stores/artistSearchStore';
	import { artistsStore } from '$lib/stores/artistsStore';
	import { releasesStore } from '$lib/stores/releasesStore';
	import { loadingStore } from '$lib/stores/loadingStore';
	import albumPaginationStore from '$lib/stores/albumPaginationStore';

	import { fetchArtistReleases } from '$lib/utils/fetchArtistReleases';

	let timeout: number;

	// Function to fetch artists from the MusicBrainz API
	const fetchArtists = async (query: string) => {
		if (!query || query.length < 2) {
			searchResults.set([]);
			return;
		}

		const response = await fetch(
			`https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(query)}&fmt=json&limit=10`
		);
		const data = await response.json();
		const newArtists = data.artists.filter(
			(artist: { id: string }) => !$releasesStore.some((release) => release.artistId === artist.id)
		);
		searchResults.set(newArtists);
	};

	// Watch for changes to the search term and fetch artists
	$: searchTerm.subscribe((term: string) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fetchArtists(term), 200); // debounce API calls
	});

	const addArtist = async (id: string, name: string): Promise<void> => {
		$searchTerm = '';
		searchResults.set([]);
		loadingStore.set({ isActive: true, message: name });
		artistsStore.add({ id, name });
		albumPaginationStore.goToPage(1);

		const artisReleases = await fetchArtistReleases(id);
		loadingStore.set({ isActive: false });
		artisReleases.forEach((release) => {
			releasesStore.add(release);
		});
	};

	const duration: number = 250;
</script>

<div>
	<input
		type="text"
		placeholder={$loadingStore.isActive ? 'Loading...' : 'Add artist to follow...'}
		bind:value={$searchTerm}
		disabled={$loadingStore.isActive}
		autocomplete="off"
	/>
	{#if $searchResults.length}
		<ul in:slide={{ duration }} out:slide={{ duration: duration / 2 }}>
			{#each $searchResults as artist}
				<li>
					<button on:click={() => addArtist(artist.id, artist.name)}>
						{artist.name}
						{#if artist.disambiguation}
							<small>{artist.disambiguation}</small>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	div {
		position: relative;
		z-index: 3;
		font-size: 0.875rem;
	}
	input {
		display: block;
		width: 100%;
		border: none;
		border-radius: 0;
		padding: 0 0.5em;
		outline: none;
		background: transparent;
		color: inherit;
		height: 2.5rem;
		padding-inline: 1rem;
		font-size: 1rem;

		&::placeholder {
			font-size: 0.75rem;
		}
	}
	ul {
		display: block;
		background: var(--color-pale);
		list-style: none;
		max-height: 12rem;
		overflow: auto;
		border-block-start: 1px solid var(--color-border);
	}

	button {
		background: transparent;
		border-radius: 0;
		border: none;
		display: block;
		padding: 0.5rem 1rem;
		cursor: pointer;
		color: var(--color-fg);
		width: 100%;
		text-align: start;
		outline: none;
		font-size: 0.75rem;
		transition: all 0.1s ease-out;
		font-weight: 700;
		&:hover,
		&:focus-visible {
			background: var(--color-accent-primary);
			color: var(--color-bg);

			& > small {
				opacity: 0.8;
			}
		}
	}
	small {
		opacity: 0.8;
		font-size: 0.6875rem;
		display: block;
		font-weight: 400;
	}
</style>
