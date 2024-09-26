<script lang="ts">
	import truncate from 'truncate';
	import { AudioTrack, AlbumCover } from '$lib/components';
	import { artistsStore } from '$lib/stores';
	import { Check } from '$lib/icons';
	import type { BandcampAlbum } from '$lib/types';

	export let album: BandcampAlbum;
	export let isFollowing: boolean;
	const isShortDescription: boolean = !!album.description && album.description.length < 240;
	let isDescriptionTruncated: boolean = true;
</script>

<div class="details">
	{#if album.tracks}
		<h2>Tracklist</h2>
		<ol>
			{#each album.tracks as track, i}
				<AudioTrack
					track={{
						...track,
						artist: album.artist.name || '',
						position: track.position || i + 1,
						cover: album.imageUrl
					}}
				/>
			{/each}
		</ol>
	{/if}
</div>
<div class="artwork">
	<AlbumCover src={album.imageUrl || ''} alt={album.name || ''} width={250} height={250} />
	{#if album.releaseDate}
		<div class="release-date">
			<h2>Release Date</h2>
			<p>
				<b>
					<time datetime={new Date(album.releaseDate).toISOString()}>
						{new Date(album.releaseDate).toLocaleDateString()}
					</time>
				</b>
			</p>
		</div>
	{/if}

	<div class="purchase">
		<h2>Purchase on Bandcamp</h2>
		<p>
			<a href={album.url} target="_blank" rel="noopener noreferrer"><i>{album.name}</i></a>
		</p>
	</div>
	{#if album.description}
		<div class="description">
			<h2>Description</h2>
			<p class={isDescriptionTruncated ? '' : 'expanded'}>
				{#if isDescriptionTruncated && !isShortDescription}
					{truncate(album.description, 180)}
					<button
						class="link-button"
						type="button"
						on:click={() => (isDescriptionTruncated = false)}
					>
						More
					</button>
				{:else}
					{album.description}
					{#if !isShortDescription}
						<button
							class="link-button"
							type="button"
							on:click={() => (isDescriptionTruncated = true)}
						>
							Less
						</button>
					{/if}
				{/if}
			</p>
		</div>
	{/if}
	{#if $artistsStore}
		<div class="follow">
			{#if isFollowing}
				<button
					class="button small muted"
					on:click={() => {
						if (album.artist.id) {
							artistsStore.remove(album.artist.id);
						}
					}}
					aria-label={`Unfollow ${album.artist.name}`}
				>
					Unfollow
				</button>
			{:else}
				<button
					class="button small"
					on:click={() => {
						if (album.artist.id && album.artist.name) {
							artistsStore.add({ id: album.artist.id, name: album.artist.name });
						}
					}}
					aria-label={`Follow ${album.artist.name}`}
				>
					<Check width="1em" />
					Follow
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	ol {
		display: table;
		width: 100%;
		font-size: 0.875rem;
		border-block-start: 1px solid var(--color-border);
	}

	.description {
		font-size: 0.8125rem;
		line-height: 1.5;
		position: relative;

		&:has(.expanded):after {
			content: '';
			pointer-events: none;
			width: 100%;
			height: 3em;
			background: linear-gradient(transparent, var(--color-bg));
			position: absolute;
			bottom: 0;
			left: 0;
			z-index: 1;
		}

		& > p {
			max-height: 15em;
			overflow: auto;

			&.expanded {
				padding-block-end: 2em;
			}
		}
	}

	h2 {
		font-size: 0.875rem;
		text-transform: uppercase;
		color: var(--color-medium);
	}

	.link-button {
		background: transparent;
		padding: 0;
		border: none;
		display: inline;
		color: var(--color-accent-primary);
		cursor: pointer;
		text-decoration: underline;
	}

	.artwork {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		@media (min-width: 1024px) {
			width: 35%;
		}
	}

	.details {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
