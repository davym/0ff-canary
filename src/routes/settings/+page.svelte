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
			<h2>Download Artist Data</h2>
			<p>
				This will download a <code>.json</code> file that can be used to regenerate an artist list (see
				below) and retrieve releases. This is handy for syncing the application between devices, sharing
				libraries, or for back up purposes.
			</p>
			<p>
				<button
					on:click={() => downloadLocalStorageItem('artistsStore')}
					class="button"
					disabled={!$artistsStore.length}
				>
					Download Artist Data
				</button>
			</p>

			<h2>Upload/Restore Artist Data</h2>

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

			<h2>Delete Data</h2>
			<p>
				<b>Delete Release Data</b> will delete all fetched releases from your
				<code>localStorage</code>. This is handy if things every get out of sync, or something's
				missing. Release data will be freshly refetched / regenerated.
			</p>
			<p>
				<b>Delete All Data</b> will completely reset the application. It will remove all releases
				<i>and</i> artists.
			</p>
			<p>
				<button
					class="button"
					on:click={() => {
						message = null;
						releasesStore.set([]);
					}}
					disabled={!$releasesStore.length}>Delete Release Data</button
				>
				<button
					class="button danger"
					on:click={() => {
						message = null;
						artistsStore.set([]);
						releasesStore.set([]);
					}}
					disabled={!$releasesStore.length && !$artistsStore.length}>Delete All Data</button
				>
			</p>
		</div>
	</div>
</div>
