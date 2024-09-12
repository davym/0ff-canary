<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { flip } from 'svelte/animate';
	import { fade, slide } from 'svelte/transition';

	import {
		artistsStore,
		releasesStore,
		loadingStore,
		filtersStore,
		albumPaginationStore
	} from '$lib/stores';

	import { AlbumListItem } from '$lib/components';

	import { LoadingSpinner, ArrowLeft, ArrowRight, Canary } from '$lib/icons';

	import type { Release, Artist } from '$lib/types';

	import {
		fetchArtistReleases,
		sortArtistsByName,
		groupArtistsByName,
		getMissingArtistsFromReleases,
		deleteOrphanedReleases
	} from '$lib/utils';

	let releases: Release[] = [];
	const rate: number = 1001;
	let artistFilterWidth: string = '16ch';

	const handleFilterChange = (event: Event): void => {
		const selectElement = event.target as HTMLSelectElement;
		artistFilterWidth = `${selectElement.options[selectElement.selectedIndex].text.length + 5}ch`;
		albumPaginationStore.goToPage(1);
	};

	const handlePageSelect = (event: Event): void => {
		const selectElement = event.target as HTMLSelectElement;
		window.scrollTo({ top: 0 });
		albumPaginationStore.goToPage(parseInt(selectElement.value));
	};

	const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	onMount(() => {
		deleteOrphanedReleases();

		const initialReleases = get(releasesStore);
		const initialArtists = get(artistsStore);
		const missingArtists = getMissingArtistsFromReleases(initialArtists, initialReleases);

		if (missingArtists.length) {
			fetchData(missingArtists);
		} else {
			releases = initialReleases;
		}

		const unsubscribeReleasesStore = releasesStore.subscribe((releasesValue) => {
			releases = releasesValue;
		});

		// const unsubscribeArtistsStore = artistsStore.subscribe((artistsValue) => {
		// 	// Handle artists updates here if necessary
		// });

		// Cleanup subscriptions
		return () => {
			unsubscribeReleasesStore();
			// unsubscribeArtistsStore();
		};
	});

	const fetchData = async (artistsToFetch?: Artist[]) => {
		const artists =
			artistsToFetch ||
			(await new Promise<Artist[]>((resolve) => {
				artistsStore.subscribe((data) => resolve(data))();
			}));

		loadingStore.set({ isActive: true });

		async function fetchReleasesWithControlledRate(artists: Artist[], maxRetries = 3) {
			const promises = [];

			for (const [i, artist] of artists.entries()) {
				// Function to fetch with retries if the response is an empty array
				const fetchWithRetry = async (artistId: string, retries: number): Promise<Release[]> => {
					const releases = await fetchArtistReleases(artistId);

					// Update the loadingStore with the current artist being processed
					loadingStore.update((state) => ({
						...state,
						message: artist.name
					}));

					// If the response is empty, retry up to maxRetries
					if (retries <= 0) {
						artistsStore.remove(artistId);
					} else if (releases.length === 0) {
						console.log(`Requeueing request for artist ${artistId}, ${retries} retries left...`);
						await delay((artists.length - i) * rate); // Wait 1 second before retrying
						return fetchWithRetry(artistId, retries - 1);
					}

					return releases;
				};

				// Add the fetchWithRetry to the promises array
				promises.push(fetchWithRetry(artist.id, maxRetries));

				await delay(rate);
			}

			// Wait for all the promises to resolve
			const allReleases = await Promise.all(promises);

			// Clear the loading message
			loadingStore.update((state) => ({ ...state, message: undefined }));

			return allReleases.flat();
		}

		const allReleases = await fetchReleasesWithControlledRate(artists);

		// Remove duplicates based on title
		const uniqueReleases = await Array.from(
			new Map(allReleases.map((release) => [`${release.title}`, release])).values()
		);
		// Ensure the release dates are valid and sort by release date (newest first)
		releases = uniqueReleases.filter((release) => release.date);

		releasesStore.update((state) => {
			state = state || [];
			const existingIds = new Set(state.map((item) => item.id));
			const newReleases = releases.filter((release) => !existingIds.has(release.id));
			return [...state, ...newReleases];
		});
		loadingStore.set({ isActive: false });
	};

	$: finalReleases = releases
		.filter((release) => release.date)
		.filter((release) =>
			$filtersStore.type.some((filter) => filter.checked && filter.value === release.type)
		)
		.filter((release) => {
			return (
				$filtersStore.artist === '' ||
				release.artists.some((artist) => artist.artist.id === $filtersStore.artist)
			);
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	$: slicedReleases = finalReleases.slice(
		($albumPaginationStore.currentPage - 1) * $albumPaginationStore.albumsPerPage,
		$albumPaginationStore.currentPage * $albumPaginationStore.albumsPerPage
	);

	const duration: number = 250;

	$: sortedArtists = sortArtistsByName($artistsStore);
	$: groupedArtists = groupArtistsByName(sortedArtists);

	$: pTotal = Math.ceil(finalReleases.length / $albumPaginationStore.albumsPerPage);
	$: releasesOnPageStart =
		($albumPaginationStore.currentPage - 1) * $albumPaginationStore.albumsPerPage + 1;
	$: releasesOnPageEnd =
		releasesOnPageStart + $albumPaginationStore.albumsPerPage >= finalReleases.length
			? finalReleases.length
			: releasesOnPageStart - 1 + $albumPaginationStore.albumsPerPage;
</script>

<svelte:head>
	<title>CANARY</title>
</svelte:head>

<div class="container">
	{#if $loadingStore.isActive}
		<div class="loading" in:fade={{ duration: duration / 2 }} out:fade={{ duration }}>
			<LoadingSpinner width="1.5rem" height="1.5rem" />
			<div class="loading__message">
				<span>Loading...</span>
				{#if $loadingStore.message}
					{$loadingStore.message}
				{:else}
					&nbsp;
				{/if}
			</div>
		</div>
	{/if}
	{#if releases.length > 0}
		<div class="filters" out:slide={{ duration }}>
			{#if slicedReleases}
				<div class="filters__title">
					<b
						aria-label={!$loadingStore.isActive
							? `Showing ${releasesOnPageStart.toLocaleString()} to ${releasesOnPageEnd.toLocaleString()} of ${finalReleases.length.toLocaleString()} results`
							: ''}
					>
						{#if $loadingStore.isActive}
							--
						{:else}
							{#if slicedReleases.length}{releasesOnPageStart.toLocaleString()}–{releasesOnPageEnd.toLocaleString()}{:else}0{/if}<small
								>/{finalReleases.length.toLocaleString()}</small
							>
						{/if}
					</b>
				</div>
			{/if}
			<div class="filters__artists">
				<label for="filter-artists" class="visually-hidden">Filter releases by artist</label>
				<select
					name="filter-artists"
					id="filter-artists"
					bind:value={$filtersStore.artist}
					on:change={handleFilterChange}
					style="max-width:{artistFilterWidth}"
				>
					<option value="">All Artists</option>
					{#each Object.keys(groupedArtists) as key}
						<optgroup label={key.toUpperCase()}>
							{#each groupedArtists[key] as { id, name }}
								<option value={id}>{name}</option>
							{/each}
						</optgroup>
					{/each}
				</select>
			</div>
			<div class="filters__type">
				{#each $filtersStore.type as filter (filter.value)}
					<label aria-label={`${filter.checked ? 'Exclude' : 'Include'} ${filter.value}s`}>
						<input
							type="checkbox"
							name="filter"
							bind:checked={filter.checked}
							value={filter.value}
							on:change={handleFilterChange}
						/>
						<span>{filter.value}s</span>
					</label>
				{/each}
			</div>
		</div>

		<div class="content">
			<div class="releases" out:fade={{ duration }}>
				{#each slicedReleases as release (release.id)}
					<div animate:flip={{ duration }} in:fade={{ delay: duration / 2, duration }} class="item">
						<AlbumListItem
							title={release.title}
							cover={release.cover}
							type={release.type}
							artists={release.artists}
							date={new Date(release.date)}
							id={release.id}
						/>
					</div>
				{/each}
			</div>
			{#if finalReleases.length > $albumPaginationStore.albumsPerPage}
				<div class="pagination">
					{#if $albumPaginationStore.currentPage > 1}
						<button
							class="button icon"
							on:click={() => {
								window.scrollTo({ top: 0 });
								albumPaginationStore.decrement();
							}}
							aria-label="Previous page of results"
						>
							<ArrowLeft width="1em" height="1em" />
						</button>
					{/if}
					<label aria-label={`Page ${$albumPaginationStore.currentPage} of ${pTotal}`}>
						<select on:change={handlePageSelect}>
							{#each { length: pTotal } as _, i}
								{#if $albumPaginationStore.currentPage === i + 1}
									<option value={i + 1} selected>
										{i + 1}/{pTotal}
									</option>
								{:else}
									<option value={i + 1}>
										{i + 1}/{pTotal}
									</option>
								{/if}
							{/each}
						</select>
					</label>
					{#if $albumPaginationStore.currentPage < pTotal}
						<button
							class="button icon"
							on:click={() => {
								window.scrollTo({ top: 0 });
								albumPaginationStore.increment();
							}}
							aria-label="Next page of results"
						>
							<ArrowRight width="1em" height="1em" />
						</button>
					{/if}
				</div>
			{/if}
		</div>
	{:else}
		<div class="watermark" in:fade={{ duration }} out:fade={{ duration }}>
			<Canary width="10rem" />
			<div class="message">
				<h2>Nothing to see here.</h2>
				<p>Try adding some artists to follow.</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.watermark {
		position: fixed;
		inset: var(--grid-size) 0 0 0;
		padding: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 1rem;
		text-align: center;
		color: var(--color-medium);
		font-size: 0.875rem;

		& > svg {
			opacity: 0.25;
		}

		@media screen and (min-width: 768px) {
			inset: var(--grid-size) 0 0 var(--width-sidebar);
		}
	}

	.message {
		& h2 {
			font-size: 1.125em;
			margin-block-end: 0.25em;
		}
	}

	.loading {
		background: var(--color-bg-translucent);
		position: fixed;
		inset: 0;
		z-index: 99;
		padding: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 0.75rem;

		@media screen and (min-width: 768px) {
			inset: 0 0 0 var(--width-sidebar);
		}
	}

	.loading__message {
		font-size: 0.8125rem;
		text-align: center;
		font-weight: 700;

		& span {
			font-weight: 400;
			display: block;
			text-transform: uppercase;
			font-size: 0.625rem;
			color: var(--color-muted);
			margin-block-end: 0.5em;
		}
	}
	.filters {
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
	}
	.filters__title {
		flex-shrink: 0;
		white-space: nowrap;
		position: sticky;
		left: 0;
		background: var(--color-bg);
		height: 100%;
		display: flex;
		align-items: center;
		padding-inline: 1rem 0.5rem;

		& small {
			font-size: inherit;
			color: var(--color-muted);
		}
	}
	.filters__type {
		flex: 1;
		flex-shrink: 0;
		display: flex;
		gap: 0.5rem;
		padding-inline: 0.5rem;
	}
	.filters__artists {
		padding-inline: 0.5rem;

		& select {
			width: 100%;
			min-width: 16ch;
			font: inherit;
			display: block;
			padding: 0.25rem;
			border: 1px solid var(--color-border);
			background: var(--color-bg);
			color: var(--color-fg);
			font-weight: 700;
			outline: none;
		}
	}
	.releases {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;

		@media screen and (min-width: 540px) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		@media screen and (min-width: 1024px) {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		@media screen and (min-width: 1260px) {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
		@media screen and (min-width: 1440px) {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
	}

	.filters__type label {
		background: var(--color-faded);
		color: var(--color-fg) fff99;
		display: inline-block;
		line-height: 1;
		overflow: hidden;
		border-radius: 1em;
		cursor: pointer;
		font-weight: bold;
		transition: color 0.1s ease-out;

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				color: var(--color-fg);
			}
		}

		& span {
			display: block;
			padding: 0.375em 0.6875em;
			transition:
				color 0.1s ease-out,
				background 0.1s ease-out;

			@media (min-width: 768px) {
				padding: 0.5em 1em;
			}
		}
	}

	input {
		position: absolute;
		visibility: hidden;
		pointer-events: none;
	}
	input:checked[value='Album'] + span {
		background: var(--color-album);
		color: var(--color-bg);
	}
	input:checked[value='Single'] + span {
		background: var(--color-single);
		color: var(--color-fg);
	}
	input:checked[value='EP'] + span {
		background: var(--color-ep);
		color: var(--color-bg);
	}

	.pagination {
		display: flex;
		height: 3rem;
		margin-block: 3rem;

		& label {
			border: 0.125rem solid var(--color-fg);
			border-inline-width: 0;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			&:first-child {
				border-inline-start-width: 0.125rem;
			}

			&:last-child {
				border-inline-end-width: 0.125rem;
			}
		}
		& select {
			border: none;
			padding: 0 1.25rem;
			appearance: none;
			-webkit-appearance: none;
			border-radius: 0;
			background: transparent;
			outline: 0;
			line-height: 2.75rem;
			color: inherit;
			height: 100%;
			cursor: pointer;
			text-align: center;
			transition:
				color 0.1s ease-out,
				background 0.1s ease-out;

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					background: var(--color-fg);
					color: var(--color-bg);
				}
			}
		}
	}
</style>
