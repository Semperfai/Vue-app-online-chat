<template>
	<div class="app">
		<div class="app__wrapper">
			<decor />
			<div class="app__container">
				<router-view />
			</div>
		</div>
	</div>
</template>
 
<script>
import Decor from '@/components/Decor.vue';
export default {
	name: "App",
	components: { Decor }
};
</script>
<style lang="scss">

</style>
