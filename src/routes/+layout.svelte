<script lang="ts">
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';
	import '$lib/styles/app.css';
	import '$lib/styles/nprogress.css';
	import { SideBar, MusicPlayer } from '$lib/components';
	import { sideBarStore } from '$lib/stores';

	NProgress.configure({
		minimum: 0.16,
		showSpinner: false
	});

	$: {
		if ($navigating) {
			NProgress.start();
			sideBarStore.set(false);
		}
		if (!$navigating) {
			NProgress.done();
		}
	}
</script>

<SideBar />

<main class={$sideBarStore ? 'sideBarOpen' : undefined}>
	<slot />
</main>

<MusicPlayer />

<style>
	main {
		width: 100%;
		position: relative;
		flex: 1;
		height: 100%;

		@media (width < 768px) {
			transform-origin: top right;
			transition: all 0.6s var(--ease-out-expo);
			transition-property: transform, opacity, filter;
		}
	}
	:global(body:has(main.sideBarOpen)) {
		@media (width < 768px) {
			overflow: hidden;

			& main {
				transform: perspective(3000px) rotateY(-15deg) scale(0.95);
				opacity: 0.5;
				filter: grayscale(100%);
				pointer-events: none;
			}
		}
	}
</style>
