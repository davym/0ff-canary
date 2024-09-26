<script lang="ts">
	import { AlbumCover } from '$lib/components';
	import type { OtherAlbum } from '$lib/types';
	import { artistsStore } from '$lib/stores';
	import { Check } from '$lib/icons';
	export let album: OtherAlbum;
	export let isFollowing: boolean;

	$: searchString = encodeURIComponent(`${album.artist.name} ${album.name}`);
</script>

<div class="details">
	<div class="prose">
		<h2>Bummer :(</h2>
		<p>
			Looks like this release isn't available to purchase or stream on Bandcamp. Most likely this
			artist is on a major label or predates Bandcamp itself. Here are some options to listen to
			and/or purchase this release...
		</p>
		<h3>Purchase</h3>
		<ul>
			<li>
				<a
					href="https://bandcamp.com/search?q={searchString}&item_type=a"
					target="_blank"
					rel="noopener noreferrer">Bandcamp</a
				>
				<small>(it‘s worth a shot)</small>
			</li>
			<li>
				<a
					href={`https://www.discogs.com/search?q=${searchString}&type=release`}
					target="_blank"
					rel="noopener noreferrer"
				>
					Discogs
				</a>
			</li>
			<li>
				<a href={`https://www.amazon.com/s?k=${searchString}`} target="_blank" rel="noopener">
					Amazon
				</a>
			</li>
		</ul>
		<h3>Stream</h3>
		<ul>
			<li>
				<a
					href="https://open.spotify.com/search/{searchString}/albums"
					target="_blank"
					rel="noopener noreferrer"
				>
					Spotify
				</a>
			</li>
			<li>
				<a
					href="https://music.apple.com/us/search?term={searchString}"
					target="_blank"
					rel="noopener noreferrer"
				>
					Apple Music
				</a>
			</li>
			<li>
				<a
					href="https://www.deezer.com/search/{searchString}/album"
					target="_blank"
					rel="noopener noreferrer"
				>
					Deezer
				</a>
			</li>
			<li>
				<a
					href="https://music.youtube.com/search?q={searchString}"
					target="_blank"
					rel="noopener noreferrer"
				>
					YouTube Music
				</a>
			</li>
		</ul>
	</div>
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

	.prose {
		max-width: 36em;
	}

	.release-date h2 {
		font-size: 0.875rem;
		text-transform: uppercase;
		color: var(--color-medium);
	}
</style>
