<script lang="ts">
	export let width: number | string | null = null;
	export let height: number | string | null = null;
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} fill-rule="evenodd" viewBox="0 0 282 235">
	<path
		class="m"
		fill="var(--color-accent-secondary)"
		d="M205 194.4c-23 23.1-53 39.8-88 39.8a117.1 117.1 0 1 1 116.8-125.9c.2 2.4 37.9 5 48 64 .3 1.9-44.5-10.5-76.9 22.1ZM128.3 40.3a63.1 63.1 0 1 1 0 126.2 63.1 63.1 0 0 1 0-126.2Z"
	/>
	<path
		class="y"
		fill="var(--color-accent-tertiary)"
		d="M205 194.4c-23 23.1-53 39.8-88 39.8a117.1 117.1 0 1 1 116.8-125.9c.2 2.4 37.9 5 48 64 .3 1.9-44.5-10.5-76.9 22.1ZM128.3 40.3a63.1 63.1 0 1 1 0 126.2 63.1 63.1 0 0 1 0-126.2Z"
	/>
	<path
		class="c"
		fill="var(--color-accent-primary)"
		d="M205 194.4c-23 23.1-53 39.8-88 39.8a117.1 117.1 0 1 1 116.8-125.9c.2 2.4 37.9 5 48 64 .3 1.9-44.5-10.5-76.9 22.1ZM128.3 40.3a63.1 63.1 0 1 1 0 126.2 63.1 63.1 0 0 1 0-126.2Z"
	/>
	<path
		class="k"
		fill="var(--color-bg)"
		d="M205 194.4c-23 23.1-53 39.8-88 39.8a117.1 117.1 0 1 1 116.8-125.9c.2 2.4 37.9 5 48 64 .3 1.9-44.5-10.5-76.9 22.1ZM128.3 40.3a63.1 63.1 0 1 1 0 126.2 63.1 63.1 0 0 1 0-126.2Z"
	/>
</svg>

<style>
	svg {
		overflow: visible;
		font-size: 2rem;

		& path {
			transition:
				fill 1s cubic-bezier(0.34, 1.56, 0.64, 1),
				transform 1s cubic-bezier(0.34, 1.56, 0.64, 1),
				opacity 0.2s ease-out;
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
		&:hover {
			& path {
				transform: none;
				transition:
					fill 1s cubic-bezier(0.34, 1.56, 0.64, 1),
					transform 1s cubic-bezier(0.34, 1.56, 0.64, 1),
					opacity 0.5s ease-out 0.5s;

				&:not(.k) {
					opacity: 0;
				}

				&.k {
					fill: var(--color-fg);
				}
			}
		}
	}
</style>
