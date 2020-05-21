<script>
	import LeftColumn from './LeftColumn.svelte';
	import RightColumn from './RightColumn.svelte';
</script>
	<!-- Wrapper -->
	<div id="wrapper" class="divided">
		
		<section class="banner style1 orient-left content-align-left image-position-right fullscreen onload-image-fade-in onload-content-fade-right">
		
			<LeftColumn />

			<RightColumn />

		</section>

	</div>


<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #4e6ade;
		font-size: 3em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>