<script lang="ts">
	import { browser } from '$app/environment';
	import SecondaryPage from '$lib/components/SecondaryPage.svelte';
</script>

<svelte:head>
	<title>eavesdrop.fm | stats</title>
</svelte:head>

<SecondaryPage title="Stats">
	{#if browser}
		<p>
			Anonymous, privacy-conscious site statistics provided by
			<a href="https://www.cloudflare.com/web-analytics/">Cloudflare Web Analytics</a>.
		</p>
		<p>
			This site uses Cloudflare's privacy-first analytics that respects user privacy without cookies or tracking.
		</p>
	{:else}
		<p>The stats page is powered by Cloudflare Web Analytics.</p>
	{/if}
</SecondaryPage>
