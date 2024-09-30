<script lang="ts">
	import { MainLayout, Modal } from '$lib/components';
	import { CanaryLayered } from '$lib/icons';
	import ogImage from '$lib/assets/og-image.png';
	let showModal: boolean = false;

	const metaDescription: string =
		'A totally awesome, privacy-focused way to follow artists/bands/musicians and keep track of new releases by #0ff.';
</script>

<svelte:head>
	<title>About Canary</title>
	<meta name="description" content={metaDescription} />
	<meta property="og:title" content="About Canary" />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content="https://canary.0ff.dev/about" />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="canary.0ff.dev" />
	<meta property="twitter:url" content="https://canary.0ff.dev/about" />
	<meta name="twitter:title" content="About Canary" />
	<meta name="twitter:description" content={metaDescription} />
	<link rel="canonical" href="https://canary.0ff.dev/about" />
</svelte:head>

<MainLayout>
	<div class="container">
		<div class="content narrow">
			<div class="prose center">
				<h1>
					<CanaryLayered width="3em" />
					<span class="visually-hidden">About</span>
					<span>Canary</span>
				</h1>
				<p>
					Canary is a completely private and accountless way to follow artists and keep track of new
					releases. All data is fetched on demand from a few public external data sources (see
					below), and stored locally on your device in <code>localStorage</code>. No information is
					stored, transmitted, or tracked by Canary, the application doesn't even know you exist.
				</p>
				<p>Canary is designed, developed, and maintained by</p>
				<p>
					<a href="http://0ff.dev" target="_blank" rel="noopener">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 245 121" class="logo-0ff">
							<path
								fill="#f0f"
								d="M33 121c21 0 36-17 42-45l1-10 1-12c0-24-12-39-33-39S8 32 3 60l-2 7-1 15c0 25 12 39 33 39Zm11-91c8 0 14 6 16 16L17 74l1-7 1-4c4-21 13-33 25-33Zm-11 76c-8 0-14-5-16-16l43-28-1 7-1 4c-3 21-13 33-25 33ZM92 119h16l11-64h32l3-13h-33l2-7c1-7 6-10 15-10l19 1 2-13-20-1c-20 0-30 7-32 24l-2 6H85l-3 13h21l-11 64ZM167 119h16l11-64h32l2-13h-32l1-7c2-7 7-10 15-10l19 1 2-13-19-1c-20 0-30 7-33 24l-1 6h-21l-2 13h21l-11 64Z"
							/>
							<path
								fill="#ff0"
								d="M39 108c21 0 36-16 41-44l2-10 1-12C83 17 71 3 50 3S14 19 8 47l-1 7-1 16c0 24 12 38 33 38Zm10-91c9 0 15 6 17 17L23 62l1-8v-3c4-21 14-34 25-34ZM39 94c-9 0-14-6-16-17l43-27-1 7-1 3c-4 21-13 34-25 34ZM98 106h16l11-63h32l2-13h-32l1-7c2-7 7-11 15-11l19 2 3-13-20-1c-20 0-30 7-33 23l-1 7H91l-3 13h21l-11 63ZM172 106h17l11-63h32l2-13h-32l1-7c1-7 6-11 15-11l19 2 2-13-19-1c-20 0-30 7-33 23l-1 7h-21l-2 13h20l-11 63Z"
							/>
							<path
								fill="#0ff"
								d="M44 118c21 0 36-17 41-45l2-10 1-11c0-25-12-39-33-39S19 29 13 57l-1 7-1 15c0 25 12 39 33 39Zm10-91c9 0 15 6 17 16L28 71l1-7 1-3c3-21 13-34 24-34Zm-10 77c-9 0-14-6-16-17l43-28-1 8-1 3c-3 21-13 34-25 34ZM103 116h16l11-63h32l3-13h-33l2-8c1-6 6-10 14-10l20 1 2-12-20-1c-20 0-30 7-33 23l-1 7H96l-3 13h21l-11 63ZM177 116h17l11-63h32l2-13h-32l1-8c1-6 6-10 15-10l19 1 2-12-19-1c-20 0-30 7-33 23l-1 7h-21l-2 13h21l-12 63Z"
							/>
							<path
								fill="var(--color-fg)"
								d="M38 113c22 0 37-17 42-45l2-10 1-12C83 21 71 7 50 7S14 24 8 51l-1 7-1 16c0 24 12 39 32 39Zm11-91c9 0 15 5 16 16L23 66l1-7v-4c4-21 14-33 25-33ZM39 98c-9 0-14-6-16-16l42-28v7l-1 4c-4 21-13 33-25 33ZM98 111h16l11-64h32l2-13h-32l1-7c2-7 7-10 15-10l19 1 2-13-19-1c-20 0-30 7-33 24l-1 6H91l-3 13h21l-11 64ZM172 111h17l11-64h32l2-13h-32l1-7c1-7 6-10 15-10l19 1 2-13-19-1c-20 0-30 7-33 24l-1 6h-21l-2 13h20l-11 64Z"
							/>
						</svg>
					</a>
				</p>
			</div>
		</div>
		<hr />
		<div class="content slim">
			<div class="prose">
				<h2>Yeah, But Why?</h2>
				<ol>
					<li>I still listen to music the old fashioned way. I don't stream. I buy records.</li>
					<li>I don't have any social media accounts in order follow artists I enjoy.</li>
					<li>
						I'm getting old. The shear volume of artists I enjoy and want to follow is getting very
						large which makes it hard to keep tabs on each of them.
					</li>
				</ol>
				<p>
					Essentially, I needed a way to quickly see when any of the artists I follow release new
					music. I don't want to sign up for some weird service that will sell my data just to
					accomplish this simple task. <a
						href="https://bandcamp.com"
						target="_blank"
						rel="noopener noreferrer">Bandcamp</a
					> is actually a fantastic way to do this and buy music directly. Unfortunately, not all artists
					use it, especially "bigger" major label artists.
				</p>
				<h2>How It Works</h2>
				<p>
					You simply add artists you like to follow. This list of artists is stored entirely on your
					computer in your browser. This is not accessible by this application. From there a
					database (MusicBrainz) is queried to retrieve all releases by your artists. This release
					data is then also stored on your computer in your browser. Until you add a new artist or
					refetch your releases, you do not <em>need</em> to communicate with the Internet other than
					to fetch album artwork (from Cover Art Archive and Bandcamp).
				</p>

				<h2>Extra Features</h2>
				<ul>
					<li>
						You can view extra album detail like track listings and descriptions for all albums that
						can be found on Bandcamp
					</li>
					<li>
						Additionally, artists that choose to make tracks available to stream (low quality) on
						Bandcamp, are available to stream here.
					</li>
					<li>
						If available a link is provided to the album on Bandcamp where it can be purchased or
						preordered.
					</li>
					<li>
						Album search links are provided for popular streaming services if an album is not
						available on Bandcamp.
					</li>
				</ul>
				<hr />
				<h2>External Data Sources</h2>
				<p>Canary pulls data (album information, images, tracks, etc) from 4 primary sources:</p>
				<ul>
					<li>
						<b>
							<a href="https://musicbrainz.org/" target="_blank" rel="noopener noreferrer nofollow">
								MusicBrainz API
							</a>
						</b>
						<br />
						All artist and release data (excluding cover art) seen on main release list page.
					</li>
					<li>
						<b>
							<a
								href="https://coverartarchive.org/"
								target="_blank"
								rel="noopener noreferrer nofollow"
							>
								Cover Art Archive
							</a>
						</b>
						<br />Release covers seen on main release list page.
					</li>
					<li>
						<b>
							<a href="https://bandcamp.com" target="_blank" rel="noopener noreferrer nofollow"
								>Bandcamp</a
							>
						</b>
						<br />
						All release data seen on a release detail page including title, description, cover art, audio
						stream, tracks, etc.
					</li>
					<li>
						<b>
							<a href="https://wikipedia.org" target="_blank" rel="noopener noreferrer nofollow"
								>Wikipedia</a
							>
							/
							<a href="https://www.wikidata.org/" target="_blank" rel="noopener noreferrer"
								>Wikidata</a
							>
						</b>
						<br />
						Artist page descriptions
					</li>
				</ul>
				<hr />
				<p>
					<button
						class="button small"
						on:click={() => {
							showModal = true;
						}}>A word about analytical data</button
					>
				</p>
			</div>
		</div>
	</div>
</MainLayout>

<Modal bind:showModal title="Analytical Data">
	<p>
		While this website/application can run 100% offline—beyond initially downloading to your device
		to install (again, this is optional)—usage data is collected via <a
			href="https://plausible.io/"
			target="_blank"
			rel="noopener noreferrer">Plausible</a
		>.
	</p>
	<p>
		Plausible is an <em>extremely</em> basic web traffic analytics application that only collects
		100% anonymous website usage data like page visits, session, duration, etc. It is not
		<a href="https://plausible.io/vs-google-analytics" target="_blank" rel="noopener noreferrer"
			>Google Analytics that tracks literally everything about you</a
		>, and is borderline illegal in many countries.
	</p>
	<p>
		I only run it to see how much traffic I'm getting and what pages are being visited. I only use
		this to help improve the app, and again, it tells me nothing of you. That being said, if you are
		still uncomfortable with that, you can always <a href="/settings">opt out</a> on the settings page.
	</p>
</Modal>

<style>
	h1 {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-wrap: wrap;
		column-gap: 0.375em;
		row-gap: 0.125em;
		font-size: 4rem;
		padding-block: 0.5em 0.25em;
		letter-spacing: -0.051em;
	}
	.logo-0ff {
		height: 1.75lh;
		width: auto;
		display: inline-block;
	}
	hr {
		margin-block: 2.5rem;
	}
</style>
