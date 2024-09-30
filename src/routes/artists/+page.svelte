<script lang="ts">
	import data from './popularArtists.json';
	import { MainLayout } from '$lib/components';
	import { sortArtistsByName, groupArtistsByName } from '$lib/utils';
	import { sideBarStore } from '$lib/stores';
	import type { Artist } from '$lib/types';

	$: sortedArtists = sortArtistsByName(data as Artist[]);
	$: groupedArtists = groupArtistsByName(sortedArtists);

	const metaTitle: string = 'Random Collection of Artists';
	const metaDescription: string =
		'A—periodically updated—random assortment of links to artist pages that users of Canary have visited.';
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDescription} />
	<meta property="og:title" content={metaTitle} />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://canary.0ff.dev/artists" />
	<meta property="twitter:domain" content="canary.0ff.dev" />
	<meta property="twitter:url" content="https://canary.0ff.dev/artists" />
	<meta name="twitter:title" content={metaTitle} />
	<meta name="twitter:description" content={metaDescription} />
	<link rel="canonical" href="https://canary.0ff.dev/artists" />
</svelte:head>

<MainLayout>
	<div class="container">
		<div class="content narrow">
			<div class="prose center">
				<h1>Random Collection of Artists</h1>
				<p>
					This is a—periodically updated—random assortment of links to artist pages that users of
					Canary have visited. You could check them out and start following if you’d like, or add
					artists of your own choosing in the {#if $sideBarStore}menu to your left{:else}<button
							class="link"
							on:click={() => sideBarStore.set(true)}>menu to your left</button
						>{/if}.
				</p>
			</div>
		</div>
		<div class="content">
			<div class="list">
				{#each Object.keys(groupedArtists) as key}
					<div class="grouping prose">
						<h2>{key.toUpperCase()}</h2>
						<ul>
							{#each groupedArtists[key] as { id, name }}
								<li><a href={`/artist/${id}`}>{name}</a></li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</div>
</MainLayout>

<style>
	.list {
		@media (width > 540px) {
			columns: 2;
		}
		@media (width > 767px) {
			columns: 3;
		}
		@media (width > 1023px) {
			columns: 4;
		}
		@media (width > 1259px) {
			columns: 5;
		}
	}
	.grouping {
		break-inside: avoid-column;
		padding-block-end: 3rem;
	}
</style>
