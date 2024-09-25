<script lang="ts">
	import { BandcampAlbumDetails, OtherAlbumDetails, MainLayout } from '$lib/components';
	import type { PageData } from './$types';
	import type { BandcampAlbum, OtherAlbum } from '$lib/types';

	export let data: PageData;
	const album: BandcampAlbum | OtherAlbum = data.album;
</script>

<svelte:head>
	<title>
		{album.name} by {album.artist.name}
	</title>
	{#if album.imageUrl}
		<link rel="preload" fetchpriority="high" as="image" href={album.imageUrl} type="image/jpeg" />
	{/if}
</svelte:head>

<MainLayout>
	<div class="container">
		<div class="content">
			<h1>
				<b>
					{album.artist.name}
				</b>
				{album.name}
			</h1>
			<div
				class="album"
				style={album.type ? `--color-theme: var(--color-${album.type?.toLowerCase()})` : ''}
			>
				{#if album.dataSource === 'bandcamp'}
					<BandcampAlbumDetails {album} />
				{:else}
					<OtherAlbumDetails {album} />
				{/if}
			</div>
		</div>
	</div>
</MainLayout>

<style>
	h1 {
		margin-block-end: 1.5rem;
		line-height: 1.25;

		& > b {
			font-size: 1rem;
			display: block;
			line-height: 1.4;
			color: var(--color-medium);
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
	.content {
		max-width: 72rem;
	}
</style>
