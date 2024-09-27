<script lang="ts">
	import Dropzone from 'svelte-file-dropzone';
	import '$lib/styles/upload.css';
	import { MainLayout } from '$lib/components';
	import { downloadLocalStorageItem, uploadArtistsData, fadeImage } from '$lib/utils';
	import { artistsStore, releasesStore, interfaceStore, analyticsStore } from '$lib/stores';
	import type { Message } from '$lib/types';
	import why from '$lib/assets/why.gif';

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

	const handleInterfaceChange = (event: Event): void => {
		const selectElement = event.target as HTMLSelectElement;
		const value = isNaN(Number(selectElement.value))
			? selectElement.value
			: Number(selectElement.value);
		const key: string | null = selectElement.getAttribute('name');
		if (!key) {
			return;
		}
		interfaceStore.update((state) => ({
			...state,
			[key]: value as 'light' | 'dark' | number
		}));
	};
	const metaDescription: string = 'Maintain your application settings for Canary by #0ff';
</script>

<svelte:head>
	<title>Settings</title>
	<meta name="description" content={metaDescription} />
	<meta property="og:title" content="Settings" />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:type" content="website" />
</svelte:head>

<MainLayout>
	<div class="container">
		<div class="content narrow">
			<div class="prose">
				<h1>Settings</h1>
				<section>
					<h2>Interface</h2>
					<section>
						<h3>Color Mode</h3>
						<div class="prose">
							<p>
								<select
									bind:value={$interfaceStore.colorMode}
									on:change={handleInterfaceChange}
									class="select small"
									name="colorMode"
								>
									<option value="dark">Dark Mode</option>
									<option value="light">Light Mode</option>
								</select>
							</p>
							{#if $interfaceStore.colorMode === 'light'}
								<p>
									<img
										src={why}
										width="360"
										height="202"
										loading="lazy"
										alt="But why?"
										use:fadeImage
									/>
								</p>
							{/if}
						</div>
					</section>
					<section>
						<h3>Animations</h3>
						<div class="prose">
							<p>
								<select
									bind:value={$interfaceStore.animations}
									on:change={handleInterfaceChange}
									class="select small"
									name="animations"
								>
									<option value="enabled">Enabled</option>
									<option value="disabled">Disabled</option>
								</select>
							</p>
						</div>
					</section>
					<section>
						<h3>Refetch Releases</h3>
						<div class="prose">
							<p>
								<select
									bind:value={$interfaceStore.refetch}
									on:change={handleInterfaceChange}
									class="select small"
									name="refetch"
								>
									<option value={1}>Daily</option>
									<option value={7} selected={!$interfaceStore.refetch}>Weekly</option>
									<option value={30}>Monthly</option>
								</select>
							</p>
						</div>
					</section>
				</section>

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
								This will download a <code>.json</code> file that can be used to regenerate an artist
								list (see below) and retrieve releases. This is handy for syncing the application between
								devices, sharing libraries, or for back up purposes.
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
					<section>
						<h3>Analytics</h3>
						<div class="prose">
							<p>
								<button
									class="button small {$analyticsStore ? 'danger' : 'success'}"
									on:click={() => {
										analyticsStore.update((state) => !state);
									}}>Opt {$analyticsStore ? 'Out' : 'In'}</button
								>
							</p>
							{#if $analyticsStore}
								<p>
									<strong>Remember: No identifiable information is ever collected or stored.</strong
									> Please consider leaving this enabled.
								</p>
							{:else}
								<p>
									<strong>No identifiable information is ever collected or stored.</strong> Please consider
									enabling/opting-in to analytics by clicking above to help improve this app.
								</p>
							{/if}
						</div>
					</section>
				</section>
			</div>
		</div>
	</div>
</MainLayout>

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

			@media (width > 540px) {
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
