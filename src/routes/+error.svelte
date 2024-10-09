<script lang="ts">
	import { page } from '$app/stores';
	import { analyticsStore } from '$lib/stores';
</script>

<svelte:head>
	{#if $analyticsStore}
		<script>
			document.addEventListener('DOMContentLoaded', function () {
				plausible('error', {
					props: {
						url: window.location.pathname
					}
				});
			});
		</script>
	{/if}
</svelte:head>

<div class="content narrow">
	<div class="prose">
		<h1>{$page?.error?.message} 💀</h1>
		{#if $page?.error?.message === 'Not Found'}
			<p>
				<strong><em>Oops!</em></strong> It looks like the page you were looking for has moved to a new
				location, been removed, or in all likelihood, never existed at all.
			</p>
		{:else}
			<p>
				<strong><em>Oops!</em></strong> Well this is embrassing. It looks like this page is broke as
				a joke! It’s bound to happen from time to time. If you’re visitting an actual page that exists
				then it‘s most likely an external data source is down. Usually these things resolve themselves
				in a few minutes, but it’s hard to know exactly when things might be working again.
			</p>
			<p>
				If you’d like to help, supporting open source software is always a good way to ensure the
				free web remains operational.
			</p>
		{/if}
	</div>
</div>
