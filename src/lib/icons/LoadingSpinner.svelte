<script lang="ts">
	export let width: number | string | null = null;
	export let height: number | string | null = null;
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24">
	<path
		fill="currentColor"
		d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1Zm0 19a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z"
		opacity=".125"
	/>
	<path
		fill="currentColor"
		d="M12 4a8 8 0 0 1 7.89 6.7 1.53 1.53 0 0 0 1.49 1.3 1.5 1.5 0 0 0 1.48-1.75 11 11 0 0 0-21.72 0A1.5 1.5 0 0 0 2.62 12a1.53 1.53 0 0 0 1.49-1.3A8 8 0 0 1 12 4Z"
	>
		<animateTransform
			attributeName="transform"
			dur="0.4s"
			repeatCount="indefinite"
			type="rotate"
			values="0 12 12;360 12 12"
		/>
	</path>
</svg>
