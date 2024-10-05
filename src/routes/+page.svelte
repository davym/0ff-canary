<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { flip } from 'svelte/animate';
	import { expoOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { Confetti } from 'svelte-confetti';
	import { mergeArtists } from '$lib/utils';
	import ogImage from '$lib/assets/og-image.png';

	import {
		artistsStore,
		releasesStore,
		loadingStore,
		filtersStore,
		albumPaginationStore,
		interfaceStore
	} from '$lib/stores';

	import { AlbumListItem, MainLayout, ButtonSection, Modal } from '$lib/components';

	import { LoadingSpinner, CaretLeft, CaretRight, CanaryLayered, Filter } from '$lib/icons';

	import type { Release, Artist } from '$lib/types';

	import {
		fetchArtistReleases,
		sortArtistsByName,
		groupArtistsByName,
		getMissingArtistsFromReleases,
		deleteOrphanedReleases,
		getExpiredArtists
	} from '$lib/utils';
	import ToggleConfetti from '$lib/components/ToggleConfetti.svelte';

	let releases: Release[] = [];
	let showModal: boolean = false;
	const rate: number = 1001;
	const duration: number = 200;
	const itemsToPreload: number = 8;

	const handleArtistSelect = (event: Event): void => {
		const selectElement = event.target as HTMLSelectElement;
		albumPaginationStore.goToPage(1);
	};

	const handleFilterChange = (event: Event): void => {
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
		const expiredArtists = getExpiredArtists(initialArtists, $interfaceStore.refetch || 7);
		const missingArtists = getMissingArtistsFromReleases(initialArtists, initialReleases);
		const mergedArtists = mergeArtists(expiredArtists, missingArtists);

		if (mergedArtists.length) {
			fetchData(mergedArtists);
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
					artistsStore.update((items) =>
						items.map((item) =>
							item.id === artistId ? { ...item, lastFetched: new Date() } : item
						)
					);
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
		const uniqueReleases = Array.from(
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
				release.artists.some((artist) => artist.artist?.id === $filtersStore.artist)
			);
		})
		.filter(
			(release) =>
				new Date(release.date).getFullYear() >= $filtersStore.timeframe.start &&
				new Date(release.date).getFullYear() <= $filtersStore.timeframe.end
		)
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	$: slicedReleases = finalReleases.slice(
		($albumPaginationStore.currentPage - 1) * $albumPaginationStore.albumsPerPage,
		$albumPaginationStore.currentPage * $albumPaginationStore.albumsPerPage
	);

	$: sortedArtists = sortArtistsByName($artistsStore);
	$: groupedArtists = groupArtistsByName(sortedArtists);

	$: pTotal = Math.ceil(finalReleases.length / $albumPaginationStore.albumsPerPage);
	$: releasesOnPageStart =
		($albumPaginationStore.currentPage - 1) * $albumPaginationStore.albumsPerPage + 1;
	$: releasesOnPageEnd =
		releasesOnPageStart + $albumPaginationStore.albumsPerPage >= finalReleases.length
			? finalReleases.length
			: releasesOnPageStart - 1 + $albumPaginationStore.albumsPerPage;

	$: releasesTitle = !$loadingStore.isActive
		? `Showing ${releasesOnPageStart.toLocaleString()} to ${releasesOnPageEnd.toLocaleString()} of ${finalReleases.length.toLocaleString()} results`
		: '';

	$: years = Array.from(
		{
			length:
				new Date().getFullYear() -
				Math.min(...releases.map((r) => new Date(r.date).getFullYear())) +
				1
		},
		(_, i) => Math.min(...releases.map((r) => new Date(r.date).getFullYear())) + i
	).reverse();

	$: isFilterModified = !filtersStore.isInitial($filtersStore);
	$: isFilteredByCurrentYear =
		$filtersStore.timeframe.start === new Date().getFullYear() &&
		$filtersStore.timeframe.end === new Date().getFullYear();

	const metaDescription: string =
		'A simple, privacy-focused web application for keeping track of new music releases by #0ff';
</script>

<svelte:head>
	<title>Canary</title>
	<meta name="description" content={metaDescription} />
	<meta property="og:title" content="Canary" />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content="https://canary.0ff.dev" />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="canary.0ff.dev" />
	<meta property="twitter:url" content="https://canary.0ff.dev" />
	<meta name="twitter:title" content="Canary" />
	<meta name="twitter:description" content={metaDescription} />
	<link rel="canonical" href="https://canary.0ff.dev" />
	{#if slicedReleases && slicedReleases.length > 0}
		{#each { length: itemsToPreload } as _, i}
			{#if slicedReleases[i]?.cover}
				<link
					rel="preload"
					fetchpriority="high"
					as="image"
					href={slicedReleases[i].cover}
					type="image/jpeg"
				/>
			{/if}
		{/each}
	{/if}
</svelte:head>
<MainLayout>
	<h1 class="visually-hidden">Canary</h1>
	<div style="display: contents;" slot="header">
		{#if releases.length > 0 && slicedReleases}
			<div class="results-title" transition:fade={{ duration }}>
				<h2 aria-label={releasesTitle}>
					{#if $loadingStore.isActive}
						--
					{:else}
						{#if slicedReleases.length}{releasesOnPageStart.toLocaleString()}–{releasesOnPageEnd.toLocaleString()}{:else}0{/if}
						<small>of</small>
						{finalReleases.length.toLocaleString()}
						<small>releases</small>
					{/if}
				</h2>
			</div>
		{/if}
		<ButtonSection isFixedSize>
			{#if releases.length}
				<button
					aria-label="Filter Releases"
					on:click={() => {
						showModal = true;
					}}
					class={isFilterModified ? 'filter-button filter-button--modified' : 'filter-button'}
				>
					<Filter height="37.5%" />
				</button>
			{/if}
		</ButtonSection>
	</div>
	<div class="container">
		{#if $loadingStore.isActive}
			<div class="loading" in:fade={{ duration }} out:fade={{ duration, delay: duration }}>
				<LoadingSpinner width="1.5rem" height="1.5rem" />
				<div class="loading__message">
					<span>Fetching Releases</span>
					{#if $loadingStore.message}
						{$loadingStore.message}
					{:else}
						&nbsp;
					{/if}
				</div>
			</div>
		{/if}
		{#if releases.length > 0 && slicedReleases.length}
			<div class="content" in:fade={{ duration, delay: duration }} out:fade={{ duration }}>
				<div class="releases">
					{#each slicedReleases as release, i (release.id)}
						<div
							animate:flip={{ duration, easing: expoOut }}
							in:fly={{
								delay: i * (duration / 10),
								duration: duration * 2,
								y: 50,
								opacity: 0,
								easing: expoOut
							}}
							class="item"
						>
							<AlbumListItem
								title={release.title}
								cover={release.cover}
								type={release.type}
								artists={release.artists}
								date={new Date(release.date)}
								id={release.id}
								loading={i > itemsToPreload - 1 ? 'lazy' : 'eager'}
							/>
						</div>
					{/each}
					{#if slicedReleases.length < 6}
						{#each { length: 6 - slicedReleases.length } as _}
							<span></span>
						{/each}
					{/if}
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
								<CaretLeft width="1em" height="1em" />
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
								<CaretRight width="1em" height="1em" />
							</button>
						{/if}
					</div>
				{/if}
			</div>
		{:else if releases.length > 0 && !slicedReleases.length}
			<div
				class="no-filtered-releases"
				in:fade={{ duration, delay: duration }}
				out:fade={{ duration }}
			>
				<h2>Oops!</h2>
				<p>
					Looks like you
					<button
						class="link"
						on:click={() => {
							showModal = true;
						}}>filtered out</button
					> all your releases.
				</p>
				<p>
					<button
						class="button"
						on:click={() => {
							filtersStore.reset();
						}}>Reset All Filters</button
					>
				</p>
			</div>
		{:else if !releases.length}
			<div class="watermark" in:fade={{ duration, delay: duration }} out:fade={{ duration }}>
				<ToggleConfetti>
					<div slot="label">
						<CanaryLayered width="10rem" />
					</div>
					<Confetti
						colorArray={[
							'var(--color-accent-primary)',
							'var(--color-accent-secondary)',
							'var(--color-accent-tertiary)',
							'var(--color-accent-primary)'
						]}
						amount={150}
						y={[-0.9, 2]}
						x={[-3, 3]}
						disableForReducedMotion={true}
						rounded={true}
						delay={[0, 100]}
					/>
				</ToggleConfetti>
				<div class="message">
					<h2>Nothing to see here.</h2>
					<p>Try adding some artists to follow.</p>
				</div>
			</div>
		{/if}
	</div>
</MainLayout>

<Modal bind:showModal title="Filter Releases">
	<div class="filter">
		<h3>Release Type</h3>
		<div class="filter-type">
			{#each $filtersStore.type as filter (filter.value)}
				<label
					aria-label={`${filter.checked ? 'Exclude' : 'Include'} ${filter.value}s`}
					class="filter-type__item"
				>
					<input
						type="checkbox"
						name="filter"
						bind:checked={filter.checked}
						value={filter.value}
						on:change={handleFilterChange}
						class="filter-type__input"
					/>
					<span class="filter-type__label">{filter.value}s</span>
				</label>
			{/each}
			{#if $filtersStore.type.some((item) => item.checked === false)}
				<button
					class="link filter__reset-button"
					on:click={() => {
						filtersStore.update((state) => ({
							...state,
							type: [
								{
									value: 'Album',
									checked: true
								},
								{
									value: 'EP',
									checked: true
								},
								{
									value: 'Single',
									checked: true
								}
							]
						}));
					}}>Reset</button
				>
			{/if}
		</div>
	</div>
	<div class="filter">
		<h3><label for="filter-artists">Artist</label></h3>
		<div class="filter-artists">
			<select
				name="filter-artists"
				id="filter-artists"
				bind:value={$filtersStore.artist}
				on:change={handleArtistSelect}
				class="select filter-artists__select"
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
			{#if $filtersStore.artist !== ''}
				<button
					class="link filter__reset-button"
					on:click={() => {
						filtersStore.update((state) => ({
							...state,
							artist: ''
						}));
					}}>Clear</button
				>
			{/if}
		</div>
	</div>
	<div class="filter">
		<h3>
			Timeframe
			{#if !isFilteredByCurrentYear}
				<small>
					(<button
						class="link filter__reset-button"
						on:click={() => {
							filtersStore.update((state) => ({
								...state,
								timeframe: { start: new Date().getFullYear(), end: new Date().getFullYear() }
							}));
						}}>Show this year only</button
					>)
				</small>
			{/if}
		</h3>
		<div class="filter-year">
			{#if years.length}
				<div class="filter-year__group">
					<div class="filter-year__item">
						<label class="filter-year__label" for="year-start">Start</label>
						<select
							name="year-start"
							id="year-start"
							class="select filter-year__select"
							bind:value={$filtersStore.timeframe.start}
						>
							{#each years as year}
								<option value={year} disabled={year > $filtersStore.timeframe.end}>{year}</option>
							{/each}
							<option value={0}>Big Bang 💥</option>
						</select>
						{#if $filtersStore.timeframe.start !== 0}
							<button
								class="link filter__reset-button"
								on:click={() => {
									filtersStore.update((state) => ({
										...state,
										timeframe: { ...state.timeframe, start: 0 }
									}));
								}}>Clear</button
							>
						{/if}
					</div>
					<div class="filter-year__item">
						<label class="filter-year__label" for="year-end">End</label>
						<select
							name="year-end"
							id="year-end"
							class="select filter-year__select"
							bind:value={$filtersStore.timeframe.end}
						>
							<option value={9999}>Present Day 🌎</option>
							{#each years as year}
								<option value={year} disabled={year < $filtersStore.timeframe.start}>{year}</option>
							{/each}
						</select>
						{#if $filtersStore.timeframe.end !== 9999}
							<button
								class="link filter__reset-button"
								on:click={() => {
									filtersStore.update((state) => ({
										...state,
										timeframe: { ...state.timeframe, end: 9999 }
									}));
								}}>Clear</button
							>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</Modal>

<style>
	.watermark {
		padding: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 1.5rem;
		text-align: center;
		font-size: 0.875rem;
		min-height: calc(100dvh - var(--grid-size) - var(--grid-size));

		& p {
			color: var(--color-muted);
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
	}

	:global(body:has(.sb--active)) .loading {
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

	.results-title {
		height: 100%;
		padding-inline: 1rem;
		display: flex;
		align-items: center;

		@media (width > 767px) {
			padding-inline-start: 2rem;
		}

		& h2 {
			font-size: clamp(0.75rem, 0.5rem + 1.25vw, 0.875rem);
		}

		& small {
			font-size: inherit;
			color: var(--color-muted);
		}
	}

	.filter {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0.5rem 0 1.25rem;
		padding: 0.25rem 1rem;
	}

	.filter-type {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.filter-type__item {
		background: var(--color-faded);
		color: var(--color-fg-translucent);
		line-height: 1;
		overflow: hidden;
		cursor: pointer;
		font-weight: bold;
		transition:
			color 0.1s ease-out,
			background 0.1s ease-out;
		display: flex;
		gap: 0.75rem;
		padding: 1rem;
		align-items: center;

		& input[type='checkbox'] {
			font-size: 1.0625em;
			height: 1em;
			width: 1em;
		}

		&:has(input[type='checkbox'][value='Album']:checked) {
			background: var(--color-album);
			color: var(--color-bg);
		}
		&:has(input[type='checkbox'][value='Single']:checked) {
			background: var(--color-single);
			color: var(--color-fg);
		}
		&:has(input[type='checkbox'][value='EP']:checked) {
			background: var(--color-ep);
			color: var(--color-bg);
		}

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				color: var(--color-fg);
			}
		}
	}

	.filter-artists__select {
		width: 100%;
	}

	.filter-year__group {
		display: flex;
		gap: 1.5rem;
	}

	.filter-year__item {
		flex: 1;
	}

	.filter-year__label {
		display: block;
		font-weight: 700;
		font-size: 0.875rem;
		margin-block-end: 0.25rem;
	}

	.filter-year__select {
		display: block;
		width: 100%;
	}

	.releases {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(min(calc(50% - 3rem), 12rem), 1fr));
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
	.filter__reset-button {
		font-size: 0.8125rem;
		margin-block-start: 0.5rem;
	}

	.filter-button {
		position: relative;
	}

	.filter-button--modified::after {
		content: '';
		background: var(--color-accent-primary);
		width: 0.5rem;
		height: 0.5rem;
		position: absolute;
		display: block;
		right: 0.5rem;
		top: 0.5rem;
		border-radius: 50%;
	}
	.container {
		min-height: 100dvh;
	}
	.no-filtered-releases {
		display: flex;
		width: 100%;
		height: 100dvh;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		text-align: center;
		padding-inline: 2rem;

		@media (width > 767px) {
			height: calc(100dvh - var(--grid-size) - var(--grid-size));
		}
	}
</style>
