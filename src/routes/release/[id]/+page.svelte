<script lang="ts">
	import { scale } from 'svelte/transition';
	import { backOut, backIn } from 'svelte/easing';
	import { page } from '$app/stores';
	import {
		BandcampAlbumDetails,
		OtherAlbumDetails,
		MainLayout,
		ButtonSection,
		Modal
	} from '$lib/components';
	import { artistsStore } from '$lib/stores';
	import { Link, Check } from '$lib/icons';
	import type { PageData } from './$types';

	export let data: PageData;
	$: album = data.album;

	let showModal: boolean = false;
	let releaseUrlInput: HTMLInputElement;
	let isCopied: boolean = false;

	const handleCopyUrl = (): void => {
		releaseUrlInput.select();
		releaseUrlInput.setSelectionRange(0, 99999);
		navigator.clipboard.writeText(releaseUrlInput.value);
		isCopied = true;
		setTimeout((): void => {
			isCopied = false;
		}, 5000);
	};

	const domain: string = 'canary.0ff.dev';
	$: metaTitle = `${album.name} by ${album.artist.name}`;
	$: metaDescription = `Release info for “${album.name}” by ${album.artist.name} courtesy of Canary by #0ff`;
	$: canonical = `https://${domain}${$page.url.pathname}`;
	$: isFollowing = $artistsStore.some((asArtist) => asArtist.name === album.artist.name);
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDescription} />
	<meta property="og:title" content={metaTitle} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content={domain} />
	<meta property="twitter:url" content={canonical} />
	<meta name="twitter:title" content={metaTitle} />
	<meta name="twitter:description" content={metaDescription} />
	{#if album.imageUrl}
		<meta property="og:image" content={album.imageUrl} />
		<meta name="twitter:image" content={album.imageUrl} />
		<link rel="preload" fetchpriority="high" as="image" href={album.imageUrl} type="image/jpeg" />
	{/if}
	<link rel="canonical" href={canonical} />
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
			<h1>
				<a href={`/artist/${album.artist.id}`}>
					{album.artist.name}
					{#if isFollowing}
						<span
							class="following"
							aria-label={`Following ${album.artist.name}`}
							in:scale={{ duration: 300, easing: backOut }}
							out:scale={{ duration: 300, easing: backIn }}
						>
							<Check width="0.75em" />
						</span>
					{/if}
				</a>
				{album.name}
			</h1>
			<div
				class="album"
				style={album.type ? `--color-theme: var(--color-${album.type?.toLowerCase()})` : ''}
			>
				{#if album.dataSource === 'bandcamp'}
					<BandcampAlbumDetails {album} {isFollowing} />
				{:else}
					<OtherAlbumDetails {album} {isFollowing} />
				{/if}
			</div>
		</div>
	</div>
</MainLayout>

<Modal bind:showModal title={`Share “${album.name}”`}>
	<h3><label for="release-url">Release URL</label></h3>
	<div class="input-group">
		<input
			type="url"
			name="release-url"
			id="release-url"
			value={canonical}
			class="text"
			disabled
			bind:this={releaseUrlInput}
		/>
		<button class="button" on:click={handleCopyUrl}>Copy URL</button>
	</div>
	{#if isCopied}
		<p class="success">Release URL copied to clipboard!</p>
	{/if}
</Modal>

<style>
	h1 {
		margin-block-end: 1.5rem;
		line-height: 1.25;

		& > a {
			font-size: 1rem;
			display: block;
			line-height: 1.4;
			color: var(--color-medium);
			margin-block-end: 0.5rem;
			text-decoration: none;

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					text-decoration: underline;
					color: var(--color-accent-primary);
				}
			}
		}
	}
	.album {
		--color-theme: #222;
		display: flex;
		flex-direction: column-reverse;
		gap: 2rem;

		@media (min-width: 1024px) {
			flex-direction: row-reverse;
		}
	}

	.input-group {
		display: flex;
		white-space: nowrap;
	}

	.success {
		color: var(--color-positive);
	}

	.following {
		color: var(--color-accent-primary);
		display: inline-block;
	}
</style>
