<script>
	import { D } from '@mobily/ts-belt';
	import '../app.postcss';
	import { DarkMode } from 'flowbite-svelte';
</script>

<div class="app">
	<main>
		<slot />
		<!-- <DarkMode /> -->
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		padding: 1rem;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
