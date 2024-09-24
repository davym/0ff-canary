<script lang="ts">
	import { AlbumCover } from '$lib/components';
	import type { OtherAlbum } from '$lib/types';
	export let album: OtherAlbum;

	$: searchString = encodeURIComponent(`${album.artist.name} ${album.name}`);
</script>

<div class="details">
	<div class="prose">
		<h2>Bummer :(</h2>
		<p>
			Looks like this album isn't available to purchase on Bandcamp. Most likely this is an artist
			on a major label or something. Might as well stream it...
		</p>
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
</div>

<style>
	.artwork {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		@media (min-width: 1024px) {
			width: 30%;
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
