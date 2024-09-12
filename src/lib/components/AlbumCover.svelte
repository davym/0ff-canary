<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import { CD, LoadingSpinner } from '$lib/icons';

	export let src: string = '';
	export let alt: string = '';
	export let width: number = 250;
	export let height: number = 250;
	export let isFuture: boolean = false;

	let loaded: boolean = false;

	if (!src) {
		setTimeout(() => (loaded = true), 250);
	}

	const handleImageLoad = (image: HTMLImageElement): { destroy(): void } => {
		const revealImage = () => {
			loaded = true;
		};

		if (image.complete && image.naturalHeight !== 0) {
			revealImage();
		} else {
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
		<img {src} {alt} {width} {height} loading="lazy" use:handleImageLoad />
	{:else}
		<CD width="50%" height="50%" />
	{/if}
	{#if !loaded}
		<div
			out:slide={{
				duration: 800,
				delay: 600,
				easing: expoOut
			}}
			class="shade"
		></div>
	{/if}
	{#if !loaded}
		<div
			out:fade={{
				duration: 200,
				delay: 200
			}}
			class="spinner"
		>
			<LoadingSpinner width="100%" height="100%" />
		</div>
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
		background: linear-gradient(-15deg, #191919, #0d0d0d);
		box-shadow: 1px 1px 0 #191919 inset;
		aspect-ratio: 1;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;

		&.future {
			filter: grayscale(100%);
		}

		& > svg {
			opacity: 0.1;
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

	.spinner {
		position: absolute;
		width: 1.25rem;
		height: 1.25rem;
		left: 50%;
		top: 50%;
		margin: -0.75rem 0 0 -0.75rem;
		color: var(--color-bg);
		z-index: 2;
		opacity: 0.52;
	}

	img {
		object-fit: cover;
		width: 100%;
		height: 100%;
	}
</style>
