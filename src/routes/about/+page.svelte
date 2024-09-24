<script lang="ts">
	import { MainLayout, Modal } from '$lib/components';
	let showModal: boolean = false;
</script>

<svelte:head>
	<title>About Canary</title>
</svelte:head>

<MainLayout>
	<div class="container">
		<div class="content narrow">
			<div class="prose">
				<h1>About Canary</h1>
				<p>
					Canary is a completely private and accountless way to follow artists and keep track of new
					releases. All data is fetched on demand from a few public external data sources (see
					below), and stored locally on your device in <code>localStorage</code>. No information is
					stored, transmitted, or tracked by Canary, the application doesn't even know you exist.
				</p>
				<hr />
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
				<p>Canary pulls data (album information, images, tracks, etc) from 3 primary sources:</p>
				<ul>
					<li>
						<b>
							<a href="https://musicbrainz.org/" target="_blank" rel="noopener noreferrer">
								MusicBrainz API
							</a>
						</b>
						<br />
						All artist and release data (excluding cover art) seen on main release list page.
					</li>
					<li>
						<b>
							<a href="https://coverartarchive.org/" target="_blank" rel="noopener noreferrer">
								Cover Art Archive
							</a>
						</b>
						<br />Release covers seen on main release list page.
					</li>
					<li>
						<b>
							<a href="https://bandcamp.com" target="_blank" rel="noopener noreferrer">Bandcamp</a>
						</b>
						<br />
						All release data seen on a release detail page including title, description, cover art, audio
						stream, tracks, etc.
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
