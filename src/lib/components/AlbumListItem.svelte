<script lang="ts">
	import { AlbumCover, Modal } from '$lib/components';
	import { hiddenReleasesStore } from '$lib/stores';

	export let title: string;
	export let artists: Array<{ name: string }>;
	export let cover: string | undefined;
	export let date: Date;
	export let type: string | undefined;
	export let id: string;
	export let isHideable: boolean = false;
	export let loading: 'eager' | 'lazy' | undefined = undefined;

	$: isFuture = new Date() < date;

	let showModal: boolean = false;
</script>

<a
	href="/release/{id}"
	class={isFuture ? 'ali ali--future' : 'ali'}
	style={type ? `--color-theme: var(--color-${type?.toLowerCase()})` : ''}
>
	<div class="ali__cover">
		<AlbumCover src={cover || ''} alt={title || ''} width={250} height={250} {isFuture} {loading} />
		{#if isHideable}
			<button
				class="ali__hide"
				type="button"
				on:click={(e) => {
					e.stopPropagation();
					e.preventDefault();
					showModal = true;
				}}>&times;</button
			>
		{/if}
	</div>
	<div class="ali__details">
		{#if type}
			<span class="ali__type">{type}</span>
		{/if}
		<h3 class="ali__title">{title}</h3>
		<ul class="ali__list">
			<li class="ali__list-item">
				{#each artists as artist, i}
					{artist.name}
					{#if i < artists.length - 1}
						<span> + </span>
					{/if}
				{/each}
			</li>
			<li class="ali__list-item">
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
{#if isHideable}
	<Modal
		{showModal}
		title="Hide Release"
		onClose={() => {
			showModal = false;
		}}
	>
		<p>
			<b>Are you sure you want to hide <i>{title}</i> from your release list?</b>
		</p>
		<p><small><b>Note:</b> It will still be visible on the artist’s page.</small></p>
		<p>
			<button
				type="button"
				class="button warning"
				on:click={() => {
					hiddenReleasesStore.add(id);
					showModal = false;
				}}>YES! hide this release</button
			>
		</p>
	</Modal>
{/if}

<style>
	.ali {
		--color-theme: #222;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		color: inherit;
		text-decoration: none;
		min-height: 100%;
	}

	.ali--future {
		opacity: 0.5;
		transition: opacity 0.1s ease-out;

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				opacity: 1;
				& .cover {
					filter: none;
				}
			}
		}
	}

	.ali__cover {
		position: relative;

		@media (hover: hover) and (pointer: fine) {
			&:hover .ali__hide {
				opacity: 0.75;
				&:hover {
					opacity: 1;
				}
			}
		}
	}

	.ali__hide {
		position: absolute;
		right: 0;
		top: 0;
		opacity: 0.75;
		font-size: 1.5rem;
		width: 1.75rem;
		line-height: 1.75rem;
		text-align: center;
		transition: opacity 0.1s ease-out;
		text-shadow: 0 0.0625rem 0.125rem #000000cc;
		color: #fff;

		@media (hover: hover) and (pointer: fine) {
			opacity: 0;
		}
	}

	.ali__type {
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

	.ali__details {
		font-size: 0.75rem;
		line-height: 1.4;
	}

	.ali__title {
		word-wrap: break-word;
		font-size: inherit;
		text-wrap: unset;
		text-transform: none;
	}

	.ali__list {
		list-style: none;
		opacity: 0.5;
		min-height: 45px;
	}
</style>
