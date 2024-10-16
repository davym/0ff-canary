<script lang="ts">
	import { ButtonSection } from '$lib/components';
	import { Close } from '$lib/icons';
	export let showModal: boolean;
	export let title: string = '';
	export let onClose: () => void = () => {};
	let dialog: HTMLDialogElement;

	$: if (dialog) {
		if (showModal) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}

	const handleDialogClose = (): void => {
		dialog.close();
	};

	const handleOnClose = (): void => {
		onClose();
		showModal = false;
	};
</script>

<dialog
	class="m"
	bind:this={dialog}
	on:close={handleOnClose}
	aria-modal="true"
	aria-labelledby="modal-title"
>
	<div class="m__header">
		<h3 class="m__title" id="modal-title">{title}</h3>
		<div class="m__close">
			<ButtonSection isFixedSize={true}>
				<button
					on:click={handleDialogClose}
					on:keypress={(e) => {
						if (e.key === 'Escape') {
							handleDialogClose();
						}
					}}
				>
					<Close height="62.5%" />
				</button>
			</ButtonSection>
		</div>
	</div>
	<div class="m__content">
		<div class="prose">
			<slot />
		</div>
	</div>
</dialog>

<style>
	.m {
		max-height: 90dvh;
		width: min(37rem, 90vw);
		border: 0.0625rem solid var(--color-fg);
		background: var(--color-bg);
		color: var(--color-fg);
		position: fixed;
		flex-direction: column;
		margin: auto;

		&::backdrop {
			background: var(--color-bg-translucent);
		}

		&[open] {
			display: flex;
			animation: zoomIn 0.3s var(--ease-out-expo);

			&::backdrop {
				animation: fadeIn 0.3s var(--ease-out-expo);
			}
		}
	}

	.m__header {
		display: flex;
		height: var(--grid-size);
		box-shadow: 0 0.0625rem 0 var(--color-fg);
		background: var(--color-bg);
		position: sticky;
		top: 0;
	}

	.m__title {
		flex: 1;
		display: flex;
		align-items: center;
		padding-inline: 1.5rem;
		font-size: 1.5rem;
		line-height: 1;
	}

	.m__content {
		flex: 1;
		padding: 1.5rem;
	}

	.m__close {
		border-inline-start: 0.0625rem solid var(--color-fg);
	}

	@keyframes -global-zoomIn {
		from {
			transform: scale(0.8) rotate(-10deg);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes -global-fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
