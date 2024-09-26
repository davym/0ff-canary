<script lang="ts">
	export let width: number | string | null = null;
	export let height: number | string | null = null;
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} fill-rule="evenodd" viewBox="0 0 282 235">
	<path
		class="m"
		fill="#f0f"
		d="M205 194.4c-23 23.1-53 39.8-88 39.8a117.1 117.1 0 1 1 116.8-125.9c.2 2.4 37.9 5 48 64 .3 1.9-44.5-10.5-76.9 22.1ZM128.3 40.3a63.1 63.1 0 1 1 0 126.2 63.1 63.1 0 0 1 0-126.2Z"
	/>
	<path
		class="y"
		fill="#ff0"
		d="M205 194.4c-23 23.1-53 39.8-88 39.8a117.1 117.1 0 1 1 116.8-125.9c.2 2.4 37.9 5 48 64 .3 1.9-44.5-10.5-76.9 22.1ZM128.3 40.3a63.1 63.1 0 1 1 0 126.2 63.1 63.1 0 0 1 0-126.2Z"
	/>
	<path
		class="c"
		fill="#0ff"
		d="M205 194.4c-23 23.1-53 39.8-88 39.8a117.1 117.1 0 1 1 116.8-125.9c.2 2.4 37.9 5 48 64 .3 1.9-44.5-10.5-76.9 22.1ZM128.3 40.3a63.1 63.1 0 1 1 0 126.2 63.1 63.1 0 0 1 0-126.2Z"
	/>
	<path
		class="w"
		fill="#fff"
		d="M205 194.4c-23 23.1-53 39.8-88 39.8a117.1 117.1 0 1 1 116.8-125.9c.2 2.4 37.9 5 48 64 .3 1.9-44.5-10.5-76.9 22.1ZM128.3 40.3a63.1 63.1 0 1 1 0 126.2 63.1 63.1 0 0 1 0-126.2Z"
	/>
</svg>

<style>
	svg {
		overflow: visible;
		font-size: 1.75rem;

		& path {
			transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		}
		& > .c {
			transform: translate(0.4375em, 0.375em);
		}
		& > .m {
			transform: translate(-0.375em, 0.3125em);
		}
		& > .y {
			transform: translate(-0.375em, -0.3125em);
		}
		& > .w {
			filter: drop-shadow(0.125em 0.125em 0.125em #00000055);
		}
		&:hover {
			& path {
				transform: none;
			}
		}
	}
</style>
