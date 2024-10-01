<script lang="ts">
	import { onMount } from 'svelte';
	import { scale, fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { backIn, backOut, expoOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { MainLayout, AlbumListItem, ButtonSection, Modal } from '$lib/components';
	import { fetchArtistReleases } from '$lib/utils/fetchArtistReleases';
	import { Check, Link } from '$lib/icons';
	import type { PageData } from './$types';
	import { artistsStore, releasesStore } from '$lib/stores';
	import type { Release } from '$lib/types';
	export let data: PageData;

	const duration: number = 200;
	const itemsToPreload: number = 8;
	let releases: Release[] = [];
	let showModal: boolean = false;
	let artistUrlInput: HTMLInputElement;
	let isCopied: boolean = false;
	let isFetching: boolean = false;

	$: ({ id, name, extract, extract_html, wikipediaUrl } = data);
	$: releasesFromStore = $releasesStore.filter((release) => release.artistId === id);
	$: isFollowing = $artistsStore.some((asArtist) => asArtist.id === data.id);
	$: if (id) {
		loadReleases();
	}

	const loadReleases = async (): Promise<void> => {
		isFetching = true;
		if (releasesFromStore.length) {
			releases = releasesFromStore;
		} else if (id) {
			releases = [];
			releases = await fetchArtistReleases(id);
		}
		isFetching = false;
		releases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	};

	const handleCopyUrl = (): void => {
		artistUrlInput.select();
		artistUrlInput.setSelectionRange(0, 99999);
		navigator.clipboard.writeText(artistUrlInput.value);
		isCopied = true;
		setTimeout((): void => {
			isCopied = false;
		}, 5000);
	};

	onMount((): void => {
		loadReleases();
	});

	const domain: string = 'canary.0ff.dev';
	$: metaDescription = `${extract?.split('.')[0]}.`;
	$: metaTitle = `${name} - Latest Releases`;
	$: canonical = `https://${domain}${$page.url.pathname}`;
</script>

<svelte:head>
	<title>{metaTitle}</title>
	{#if extract}
		<meta name="description" content={metaDescription} />
		<meta property="og:description" content={metaDescription} />
		<meta name="twitter:description" content={metaDescription} />
	{/if}
	<meta property="og:title" content={metaTitle} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta property="twitter:domain" content={domain} />
	<meta property="twitter:url" content={canonical} />
	<meta name="twitter:title" content={metaTitle} />
	<link rel="canonical" href={canonical} />
	{#if !releases.length && !isFetching}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

<MainLayout>
	<div style="display: contents;" slot="header">
		<span></span>
		<ButtonSection isFixedSize>
			<button
				on:click={() => {
					showModal = true;
				}}
			>
				<Link height="37.5%" />
			</button>
		</ButtonSection>
	</div>
	<div class="container">
		<div class="content medium">
			<div class="intro">
				<div class="prose">
					<h1>
						{name}
						{#if isFollowing}
							<span
								class="following"
								aria-label={`Following ${name}`}
								in:scale={{ duration: 300, easing: backOut }}
								out:scale={{ duration: 300, easing: backIn }}
							>
								<Check width="0.375em" />
							</span>
						{/if}
					</h1>
					{#if extract_html}
						<div class="narrow prose" in:fade={{ duration }}>
							{@html extract_html}
							<p>
								<a href={wikipediaUrl} target="_blank" rel="noopener noreferrer nofollow">
									Continue reading at Wikipedia&hellip;
								</a>
								<br />
								<small>
									Wikipedia content provided under the terms of the
									<a
										href="https://creativecommons.org/licenses/by-sa/3.0/"
										target="_blank"
										rel="noopener noreferrer nofollow"
									>
										Creative Commons BY-SA license
									</a>
								</small>
							</p>
						</div>
					{/if}
					<hr />
					<p>
						{#if !isFollowing}
							<button
								class="button small"
								on:click={async () => {
									if (id && name) {
										artistsStore.add({ id, name });
										const artisReleases = await fetchArtistReleases(id);
										artisReleases.forEach((release) => {
											releasesStore.add(release);
										});
									}
								}}
								aria-label={`Follow ${name}`}
							>
								<Check width="1em" />
								Follow {name}
							</button>
						{:else}
							<button
								type="button"
								class="button small muted"
								on:click={() => {
									if (id) {
										artistsStore.remove(id);
									}
								}}
								aria-label={`Unfollow ${name}`}
								disabled={isFetching}
							>
								Unfollow
							</button>
							<button
								type="button"
								class="button small primary"
								on:click={async () => {
									releases = [];
									isFetching = true;
									releases = await fetchArtistReleases(id);
									releasesStore.merge(releases);
									isFetching = false;
								}}
								disabled={isFetching}
							>
								{#if !isFetching}
									Refetch Releases
								{:else}
									Fetching Releases&hellip;
								{/if}
							</button>
						{/if}
					</p>
				</div>
			</div>
			{#if releases.length}
				<div class="release-section" in:fade={{ duration }}>
					<h2>{releases.length} Releases</h2>
					<div class="releases">
						{#each releases as release, i (release.id)}
							<div
								animate:flip={{ duration, easing: expoOut }}
								in:fly={{
									delay: i * (duration / 10) + duration,
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
						{#if releases.length < 5}
							{#each { length: 5 - releases.length } as _}
								<span></span>
							{/each}
						{/if}
					</div>
				</div>
			{:else if !isFetching}
				<div class="release-section" in:fade={{ duration }}>
					<div class="prose slim">
						<h2>No Releases :(</h2>
						<p>
							This artist has no releases* in the <a
								href={`http://musicbrainz.org/artist/${id}`}
								target="_blank"
								rel="noopener noreferrer nofollow">MusicBrainz</a
							>
							database. Perhaps this is a good opportunity to
							<a
								href="https://musicbrainz.org/release/add"
								target="_blank"
								rel="noopener noreferrer">contribute</a
							>. 😉
						</p>
						<p>
							<small
								>* Compilations or albums filed under “Various Artists” are not considered an
								artist‘s release.</small
							>
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</MainLayout>

<Modal bind:showModal title="Share Artist">
	<h3><label for="artist-url">Artist URL</label></h3>
	<div class="input-group">
		<input
			type="url"
			name="artist-url"
			id="artist-url"
			value={canonical}
			class="text"
			disabled
			bind:this={artistUrlInput}
		/>
		<button class="button" on:click={handleCopyUrl}>Copy URL</button>
	</div>
	{#if isCopied}
		<p class="success">Artist URL copied to clipboard!</p>
	{/if}
</Modal>

<style>
	.container {
		min-height: 100dvh;
	}

	.release-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-block-start: 3rem;
	}

	.releases {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(min(calc(50% - 3rem), 12rem), 1fr));
	}

	.following {
		color: var(--color-accent-primary);
		display: inline-block;
	}

	small {
		color: var(--color-muted);
	}

	.input-group {
		display: flex;
		white-space: nowrap;
	}

	.success {
		color: var(--color-positive);
	}
</style>
