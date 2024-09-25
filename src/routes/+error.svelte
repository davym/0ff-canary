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
		<p>
			<strong><em>Oops!</em></strong> Well this is embrassing. It looks like you found a bug! It’s bound
			to happen from time to time. Sorry about that.
		</p>
	</div>
</div>
