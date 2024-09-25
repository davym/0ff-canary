<script lang="ts">
	import { PLAUSIBLE_API_SITE_ID, PLAUSIBLE_API_DOMAIN } from '$env/static/private';
	import { onMount } from 'svelte';
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';
	import '$lib/styles/app.css';
	import '$lib/styles/layout.css';
	import '$lib/styles/nprogress.css';
	import { SideBar, MusicPlayer, ButtonSection } from '$lib/components';
	import type { Interface } from '$lib/types';
	import { sideBarStore, interfaceStore, analyticsStore } from '$lib/stores';
	import { isMobile, navigateBack } from '$lib/utils';
	import { CaretLeft } from '$lib/icons';

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
			data-domain={PLAUSIBLE_API_SITE_ID}
			src={`${PLAUSIBLE_API_DOMAIN}/js/script.js`}
		></script>
	{/if}
</svelte:head>

<SideBar />

<slot />

<MusicPlayer />
