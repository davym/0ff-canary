<script lang="ts">
	import { tick } from 'svelte';

	export let toggleOnce: boolean = false;
	export let relative: boolean = true;

	let active: boolean = false;

	async function click(): Promise<void> {
		if (toggleOnce) {
			active = !active;
			return;
		}

		active = false;
		await tick();
		active = true;
	}
</script>

<button on:click={click} class:relative>
	<slot name="label" />
	{#if active}
		<div class="confetti">
			<slot />
		</div>
	{/if}
</button>

<style>
	.relative {
		position: relative;
	}

	.relative .confetti {
		position: absolute;
		top: 50%;
		left: 50%;
	}

	.confetti {
		pointer-events: none;
	}
</style>
