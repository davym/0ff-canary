<script lang="ts">
	import { slide } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import { CD } from '$lib/icons';

	export let src: string = '';
	export let alt: string = '';
	export let width: number = 250;
	export let height: number = 250;
	export let isFuture: boolean = false;
	export let loading: 'eager' | 'lazy' | undefined = undefined;

	let isLoaded: boolean = false;
	let isCached: boolean = true;

	if (!src) {
		setTimeout(() => (isLoaded = true), 250);
	}

	const handleImageLoad = (image: HTMLImageElement): { destroy(): void } => {
		const revealImage = () => {
			isLoaded = true;
		};

		if (image.complete && image.naturalHeight !== 0) {
			revealImage();
		} else {
			isCached = false;
			image.addEventListener('load', revealImage);
		}

		return {
			destroy() {
				image.removeEventListener('load', revealImage);
			}
		};
	};
</script>

<div class="cover {isFuture ? 'future' : ''}">
	{#if src}
		<img {src} {alt} {width} {height} {loading} use:handleImageLoad />
	{:else}
		<CD width="50%" height="50%" />
	{/if}
	{#if !isLoaded && !isCached}
		<div
			out:slide={{
				duration: 800,
				easing: expoOut
			}}
			class="shade"
		></div>
	{/if}
</div>

<style>
	@keyframes slideDown {
		100% {
			transform: scaleY(1);
		}
		100% {
			transform: scaleY(0);
		}
	}
	.cover {
		background: var(--gradient-album);
		color: var(--color-fg);
		aspect-ratio: 1;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		transition: filter 0.1s ease-out;

		&.future {
			filter: grayscale(100%);
		}

		& > svg {
			opacity: 0.08;
		}
	}

	.shade {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		bottom: 0;
		left: 0;
		background: var(--color-theme);
		z-index: 1;
	}

	img {
		object-fit: cover;
		width: 100%;
		height: 100%;
	}
</style>
