<script lang="ts">
	import { AlbumCover } from '$lib/components';

	export let title: string;
	export let artists: Array<{ name: string }>;
	export let cover: string | undefined;
	export let date: Date;
	export let type: string | undefined;
	export let id: string;

	$: isFuture = new Date() < date;
</script>

<a
	href="/release/{id}"
	class="album {isFuture && 'future'}"
	style={type ? `--color-theme: var(--color-${type?.toLowerCase()})` : ''}
>
	<AlbumCover src={cover || ''} alt={title || ''} width={250} height={250} {isFuture} />
	<div class="details">
		{#if type}
			<span class="type">{type}</span>
		{/if}
		<h3>{title}</h3>
		<ul>
			<li>
				{#each artists as artist, i}
					{artist.name}
					{#if i < artists.length - 1}
						<span> + </span>
					{/if}
				{/each}
			</li>
			<li>
				<time datetime={new Date(date).toISOString()}
					>{new Date(date).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}</time
				>
			</li>
		</ul>
	</div>
</a>

<style>
	.album {
		--color-theme: #222;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		color: inherit;
		text-decoration: none;
		min-height: 100%;

		&.future {
			opacity: 0.5;
			transition: opacity 0.1s ease-out;

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					opacity: 1;
				}
			}
		}
	}

	.type {
		float: inline-end;
		font-size: 0.6875rem;
		overflow: hidden;
		background: var(--color-theme);
		color: white;
		line-height: 1;
		width: 100%;
		width: 0.375rem;
		height: 0.375rem;
		border-radius: 0.1875rem;
		text-align: end;
		font-weight: 700;
		color: transparent;
		margin: 0.25rem 0 0 0.5rem;
	}

	.details {
		font-size: 0.75rem;
		line-height: 1.4;
	}
	h3 {
		word-wrap: break-word;
		font-size: inherit;
		text-wrap: unset;
	}
	ul {
		list-style: none;
		opacity: 0.5;
		min-height: 45px;
	}
</style>
