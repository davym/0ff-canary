<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	import { Close } from '$lib/icons';

	import musicStore from '$lib/stores/musicStore';
	import { sideBarStore } from '$lib/stores/sideBarStore';

	import { formatTime } from '$lib/utils/formatTime';

	let music: HTMLAudioElement | null = null;
	let title: string = '';
	let artist: string = '';
	let releaseId: string = '';
	let src: string = '';
	let cover: string | undefined = '';
	let isPlaying: boolean = false;
	let wasPlaying: boolean = isPlaying;
	let currentTime: number = 0;
	let duration: number = 0;
	let scrubber: number = currentTime;

	const unsubscribe = musicStore.subscribe((state) => {
		title = state.title;
		artist = state.artist;
		releaseId = state.releaseId;
		src = state.src;
		cover = state.cover;
		isPlaying = state.isPlaying;
		currentTime = state.currentTime;

		if (music) {
			if (music.src !== src) {
				music.src = src;
				music.currentTime = currentTime;
				music.onloadedmetadata = () => {
					if (music) {
						duration = music.duration;
					}
				};
			}

			if (isPlaying && music.paused) {
				music.play().catch((error) => console.error('Play error:', error));
			} else if (!isPlaying && !music.paused) {
				music.pause();
			}
		}
	});

	onMount(() => {
		return () => unsubscribe();
	});

	const handleTimeUpdate = (): void => {
		const time = music?.currentTime || 0;
		musicStore.updateCurrentTime(time);
		scrubber = time;
	};

	const handleScrubChange = (event: Event): void => {
		const inputElement = event.target as HTMLInputElement;
		if (music) {
			music.currentTime = parseInt(inputElement.value);
			handleTimeUpdate();
		}
	};
</script>

<audio
	bind:this={music}
	on:timeupdate={handleTimeUpdate}
	on:ended={() => {
		musicStore.pauseTrack();
		musicStore.updateCurrentTime(0);
	}}
/>
{#if src}
	<aside
		transition:fly={{ easing: expoOut, duration: 500, opacity: 0, y: '3rem' }}
		class={$sideBarStore ? 'compact' : ''}
	>
		{#if cover}
			<a
				href={`/release/${$musicStore.releaseId}`}
				class="cover"
				aria-label={`Go to “${title}’ by ${artist}`}
			>
				<img src={cover} alt="{title} - {artist} Cover" loading="lazy" />
			</a>
		{/if}
		<div class="control play-pause">
			<button
				aria-label={isPlaying ? 'Pause' : 'Play'}
				on:click={() =>
					isPlaying ? [musicStore.pauseTrack(), (wasPlaying = false)] : musicStore.resumeTrack()}
			>
				{#if isPlaying || wasPlaying}
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path d="M2 2h20v20h-20z" />
					</svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path d="M3 22v-20l18 10-18 10z" />
					</svg>
				{/if}
			</button>
		</div>
		<div class="progress" style="--progress: {duration ? (scrubber / duration) * 100 : 0}%">
			<input
				type="range"
				min="0"
				max={duration}
				bind:value={scrubber}
				on:mousedown={() => {
					wasPlaying = isPlaying;
					musicStore.pauseTrack();
				}}
				on:mouseup={() => {
					if (wasPlaying) {
						musicStore.resumeTrack();
					}
				}}
				on:input={handleScrubChange}
				on:change={handleScrubChange}
			/>
			<div class="bar">
				<div class="details">
					<h2>{title}</h2>
					<p>{artist}</p>
				</div>
				<div class="timing">
					<span class="current">{formatTime(currentTime)}</span>
					<span class="duration">{duration ? formatTime(duration) : '--:--'}</span>
				</div>
			</div>
			<div class="bar inverse">
				<div class="details">
					<h2>{title}</h2>
					<p>{artist}</p>
				</div>
				<div class="timing">
					<span class="current">{formatTime(currentTime)}</span>
					<span class="duration">{duration ? formatTime(duration) : '--:--'}</span>
				</div>
			</div>
		</div>
		<div class="control close">
			<button aria-label="Close music player" on:click={() => musicStore.reset()}>
				<Close width="62.5%" height="62.5%" />
			</button>
		</div>
	</aside>
{/if}

<style>
	aside {
		position: fixed;
		display: flex;
		bottom: 0;
		right: 0;
		width: 100%;
		height: var(--grid-size);
		z-index: 2;
		background: var(--color-bg);
		box-shadow: 0 -1px 0 var(--color-border);
		font-size: 0.8125rem;
		transition: all 0.3s var(--ease-out-expo);
		transition-property: margin-inline-start, width, box-shadow;

		& > div {
			flex-shrink: 0;
			&:not(:last-child) {
				border-inline-end: 1px solid var(--color-border);
			}
		}

		&.compact {
			width: calc(100% - var(--width-sidebar));
			z-index: 1000;

			@media (width < 640px) {
				justify-content: flex-end;

				& .play-pause {
					border-inline-start: 1px solid var(--color-border);
				}

				& > *:not(.play-pause) {
					display: none;
				}
			}
		}
	}
	.cover {
		aspect-ratio: 1;
		height: 100%;
		overflow: hidden;
		padding: 0;
		@media (width < 375px) {
			display: none;
		}
	}
	.cover img {
		object-fit: cover;
		width: 100%;
		height: 100%;
	}
	.details {
		line-height: 1.4;
		flex: 1;
		flex-shrink: 1;
		pointer-events: none;
		white-space: nowrap;
		overflow: hidden;
	}
	.details h2 {
		font-size: 1em;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}
	.details p {
		font-size: 0.6875rem;
		color: var(--color-muted);
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.play-pause {
		& button {
			& svg {
				display: block;
				width: 1.25rem;
				height: 1.25rem;
			}
		}
	}
	.control {
		height: 100%;
		width: var(--grid-size);

		& button {
			transition: all 0.1s ease-out;
			height: 100%;
			width: 100%;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					background: var(--color-fg);
					color: var(--color-bg);
				}
			}
		}
	}

	.timing {
		pointer-events: none;
		text-align: end;
	}

	.progress {
		--progress: 0;
		flex: 1;
		position: relative;
		display: flex;
		align-items: center;
	}

	.bar {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding-inline: 1rem;
		overflow: hidden;
		transition: clip-path 0.3s var(--ease-out-expo);
		clip-path: polygon(var(--progress) 0, 100% 0, 100% 100%, var(--progress) 100%);
		background: var(--color-bg);
		color: var(--color-fg);
		z-index: 0;

		&.inverse {
			background: var(--color-accent-primary);
			color: var(--color-bg);
			clip-path: polygon(0 0, var(--progress) 0, var(--progress) 100%, 0 100%);

			& .details p {
				color: var(--color-border);
			}
		}
	}

	input[type='range'] {
		position: relative;
		z-index: 2;
		width: 100%;
		appearance: none;
		-webkit-appearance: none;
		background: transparent;
		height: 100%;
		cursor: pointer;

		&::-webkit-slider-thumb {
			appearance: none;
			-webkit-appearance: none;
			visibility: hidden;
			width: 1rem;
			height: var(--grid-size);
		}

		&::-moz-range-thumb {
			border: none;
			border-radius: 0;
			width: 1rem;
			height: var(--grid-size);
			visibility: hidden;
		}
	}

	.duration {
		display: block;
		font-size: 0.6875rem;
		color: var(--color-muted);
	}
</style>
