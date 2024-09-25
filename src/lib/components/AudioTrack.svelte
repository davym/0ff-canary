<script lang="ts">
	import { PlayingAnimation } from '$lib/icons';
	import { formatTime } from '$lib/utils/formatTime';
	import type { BandcampAlbumTrack } from '$lib/types';
	import musicStore from '$lib/stores/musicStore';

	export let track: BandcampAlbumTrack;

	const playTrack = (): null | void => {
		if (!track.streamUrl) {
			return;
		}
		musicStore.playTrack(track.name, track.artist, track.releaseId, track.streamUrl, track.cover);
	};

	$: duration = track.duration || 0;
	$: isPlayable = !!track.streamUrl;
	$: isTrackPlaying = $musicStore.src === track.streamUrl && $musicStore.isPlaying;
</script>

<li>
	<button
		type="button"
		on:click={() => isPlayable && playTrack()}
		disabled={!isPlayable || isTrackPlaying}
		style="--progress: {isPlayable &&
		track.duration &&
		$musicStore.src === track.streamUrl &&
		$musicStore.currentTime
			? $musicStore.currentTime / track.duration
			: 0}"
	>
		<span class="position">
			{track.position}
		</span>
		<span class="name">
			{track.name}{#if isTrackPlaying}&nbsp;<PlayingAnimation width="1em" height="1em" />{/if}
		</span>
		<span class="duration">
			{formatTime(duration)}
		</span>
	</button>
</li>

<style>
	li {
		--progress: 0;
		display: block;
		position: relative;
		border-block-end: 1px solid var(--color-border);

		@media (hover: hover) and (pointer: fine) {
			&:hover button:not(:disabled) .name {
				text-decoration: underline;
			}
		}
	}

	button {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		width: 100%;
		position: relative;

		&:disabled {
			cursor: inherit;
		}

		&:not(:disabled) {
			& .name {
				color: var(--color-accent-primary);
			}
		}

		&:after {
			content: '';
			position: absolute;
			z-index: 1;
			left: 0;
			top: 0;
			height: 100%;
			width: 100%;
			transform: scaleX(var(--progress));
			background: var(--color-faded);
			transform-origin: left;
			transition: transform 0.5s var(--ease-out-expo);
		}

		& > span {
			position: relative;
			padding-block: 1rem;
			line-height: 1.2;
			z-index: 2;
		}
	}

	.name {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.position {
		text-align: end;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-muted);
		padding-inline-start: 0;
		width: 3ch;
	}

	.duration {
		text-align: end;
		padding-inline-end: 0;
		white-space: nowrap;
	}
</style>
