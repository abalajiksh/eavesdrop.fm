<script lang="ts">
	import SecondaryPage from '$lib/components/SecondaryPage.svelte';
</script>

<svelte:head>
	<title>eavesdrop.fm | about</title>
</svelte:head>

<SecondaryPage title="About">
	<p>
		Do you use Plex Music? Want to learn more about your listening habits, and maybe help engineers
		around the world build cool stuff?
	</p>

	<p>
		ListenBrainz is an open alternative to <a href="https://last.fm">last.fm</a>, so you can do just
		that. As a heavy user of Plex Music, and a fan of what the team behind ListenBrainz is up to,
		eavesdrop.fm was built to simplify the process of submitting your listening data to ListenBrainz.
	</p>

	<h3>This Fork</h3>
	<p>
		This is a modernized version of the original eavesdrop.fm, updated to use the latest web technologies:
	</p>
	<ul>
		<li><strong>SvelteKit 2</strong> - Modern full-stack framework</li>
		<li><strong>TypeScript 5</strong> - Enhanced type safety and developer experience</li>
		<li><strong>Cloudflare Pages</strong> - Global edge deployment for faster performance</li>
		<li><strong>Vite 5</strong> - Lightning-fast build tooling</li>
	</ul>
	<p>
		The migration ensures this service remains fast, secure, and maintainable for years to come.
	</p>

	<h3>License</h3>
	<p>
		This site (and accompanying webhook listener) is proudly open source software, released under
		the <a href="https://github.com/aubrey-wodonga/eavesdrop.fm/blob/main/LICENSE">MIT license</a>.
	</p>

	<h3>Source code</h3>
	<p>
		The modernized version can be found at
		<a href="https://github.com/abalajiksh/eavesdrop.fm">github.com/abalajiksh/eavesdrop.fm</a>.
		The original project is at
		<a href="https://github.com/aubrey-wodonga/eavesdrop.fm">github.com/aubrey-wodonga/eavesdrop.fm</a>.
		Contributions are welcome!
	</p>
	
	<div class="credits">
		<small>
			Originally built by <a href="https://github.com/aubrey-wodonga">aubrey-wodonga</a>
			•
			Modernized by <a href="https://github.com/abalajiksh">abalajiksh</a>
			•
			Built with <a href="https://kit.svelte.dev/">SvelteKit</a>
			•
			Deployed on <a href="https://pages.cloudflare.com/">Cloudflare Pages</a>
		</small>
	</div>
</SecondaryPage>

<style lang="scss">
	ul {
		margin: 1rem 0;
		li {
			margin: 0.5rem 0;
		}
	}

	.credits {
		background: $secondaryHighlight;
		color: #ffffff;
		border-radius: 0.5rem;
		text-align: center;
		padding: 0.8rem 1rem;
		margin-top: 2rem;
		a {
			color: #ffffff;
			text-decoration: underline;
			&:hover {
				opacity: 0.8;
			}
		}
	}
</style>
