<script lang="ts">
	import { PUBLIC_PLAUSIBLE_API_SITE_ID, PUBLIC_PLAUSIBLE_API_DOMAIN } from '$env/static/public';
	import { onMount } from 'svelte';
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';
	import '$lib/styles/app.css';
	import '$lib/styles/layout.css';
	import '$lib/styles/nprogress.css';
	import { SideBar, MusicPlayer } from '$lib/components';
	import type { Interface } from '$lib/types';
	import { sideBarStore, interfaceStore, analyticsStore } from '$lib/stores';
	import { isMobile } from '$lib/utils';

	NProgress.configure({
		minimum: 0.16,
		showSpinner: false
	});

	$: {
		if ($navigating) {
			NProgress.start();
			if (isMobile()) {
				sideBarStore.set(false);
			}
		}
		if (!$navigating) {
			NProgress.done();
		}
	}

	onMount(() => {
		const unsubscribe = interfaceStore.subscribe((value: Interface) => {
			const { colorMode, animations }: Interface = value;

			document.documentElement.classList.toggle('dark', colorMode === 'dark');
			document.documentElement.classList.toggle('light', colorMode === 'light');

			document.documentElement.classList.toggle('dynamic', animations === 'enabled');
			document.documentElement.classList.toggle('static', animations === 'disabled');
		});
		return () => {
			unsubscribe();
		};
	});
</script>

<svelte:head>
	{#if $analyticsStore}
		<script
			defer
			data-domain={PUBLIC_PLAUSIBLE_API_SITE_ID}
			src={`${PUBLIC_PLAUSIBLE_API_DOMAIN}/js/script.js`}
		></script>
	{/if}
</svelte:head>

<SideBar />

<slot />

<MusicPlayer />
