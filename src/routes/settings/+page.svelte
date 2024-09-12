<script lang="ts">
	import Dropzone from 'svelte-file-dropzone';
	import '$lib/styles/upload.css';
	import { UtilityHeader, BackLink } from '$lib/components';
	import { downloadLocalStorageItem, uploadArtistsData } from '$lib/utils';
	import { artistsStore, releasesStore } from '$lib/stores';
	import type { Message } from '$lib/types';

	let message: Message | null;
	let isDropzoneActive: boolean = false;

	interface FileObject {
		name: string;
		[key: string]: unknown;
	}

	const handleFilesSelect = async (e: CustomEvent<{ acceptedFiles: FileObject[] }>) => {
		isDropzoneActive = false;
		message = null;
		const file = e?.detail?.acceptedFiles?.[0];
		if (file) {
			const fileForUpload = file as unknown as File;
			message = await uploadArtistsData(fileForUpload);
		} else {
			message = {
				type: 'error',
				text: 'No file selected.'
			};
		}
	};
</script>

<svelte:head>
	<title>Settings - CANARY</title>
</svelte:head>

<div class="container">
	<UtilityHeader>
		<BackLink />
	</UtilityHeader>

	<div class="content narrow">
		<div class="prose">
			<h1>Settings</h1>

			<section>
				<h2>Data</h2>
				<section>
					<h3>Download Data</h3>
					<div class="prose">
						<p>
							<button
								on:click={() => downloadLocalStorageItem('artistsStore')}
								class="button small"
								disabled={!$artistsStore.length}
							>
								Download Artist Data
							</button>
						</p>
						<p>
							This will download a <code>.json</code> file that can be used to regenerate an artist list
							(see below) and retrieve releases. This is handy for syncing the application between devices,
							sharing libraries, or for back up purposes.
						</p>
					</div>
				</section>
				<section>
					<h3>Upload Data</h3>
					<div class="prose">
						<Dropzone
							on:drop={handleFilesSelect}
							multiple={false}
							accept={['application/json']}
							disableDefaultStyles={true}
							class={isDropzoneActive ? 'upload active' : 'upload'}
							on:dragenter={() => {
								isDropzoneActive = true;
							}}
							on:dragleave={() => {
								isDropzoneActive = false;
							}}
						>
							Drag 'n' drop your <code>.json</code> file here or click to upload.
						</Dropzone>
						{#if message}
							<p class="message {message.type}">{message.text}</p>
						{/if}
					</div>
				</section>
				<section>
					<h3>Delete Data</h3>
					<div class="prose">
						<p>
							<button
								class="button warning small"
								on:click={() => {
									message = null;
									releasesStore.set([]);
								}}
								disabled={!$releasesStore.length}>Delete Release Data</button
							>
						</p>
						<p>
							This will delete all fetched releases from your
							<code>localStorage</code>. This is handy if things every get out of sync, or
							something's missing.
						</p>
						<p>
							<button
								class="button danger small"
								on:click={() => {
									message = null;
									artistsStore.set([]);
									releasesStore.set([]);
								}}
								disabled={!$releasesStore.length && !$artistsStore.length}>Delete All Data</button
							>
						</p>
						<p>
							This will completely reset the application. <strong
								>It will remove all releases
								<em>and</em> artists.</strong
							> Use with caution.
						</p>
					</div>
				</section>
			</section>
		</div>
	</div>
</div>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		& > section {
			padding-block: 2rem;
			border-block-start: 0.125em solid var(--color-border);
			font-size: 0.875rem;
			line-height: 1.5;

			@media (width > 768px) {
				flex-direction: row;

				& > h3 {
					flex: 1;
				}
				& > div {
					flex: 3;
				}
			}
		}
	}
</style>
