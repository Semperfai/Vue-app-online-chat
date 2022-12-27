<template >
	<input type="text" :value="modelValue" @input="upInput" class="inp">
</template>
<script>
export default {
	name: 'my-input',
	props: {
		modelValue: [String, Number, Symbol],
	},
	methods: {
		upInput(event) {
			this.$emit('update:modelValue', event.target.value)
		},
	}
}
</script>
<style lang="scss" scoped>
.inp {
	flex: 1;
	padding: 1em 2em;
	border: 0;
	width: 100%;
	box-sizing: border-box;
	color: rgb(1, 1, 1);
	font-size: 1.4rem;
	font-family: Open Sans, Arial, sans-serif;
	border-radius: 30px;
	background: #fffa69;
	background: -moz-linear-gradient(top, #fffa69 0%, #e7f6ef 100%);
	background: -webkit-gradient(left top, left bottom, color-stop(0%, #fffa69), color-stop(100%, #e7f6ef));
	background: -webkit-linear-gradient(top, #fffa69 0%, #e7f6ef 100%);
	background: -o-linear-gradient(top, #fffa69 0%, #e7f6ef 100%);
	background: -ms-linear-gradient(top, #fffa69 0%, #e7f6ef 100%);
	background: linear-gradient(to bottom, #fffa69 0%, #e7f6ef 100%);

	@media (max-width: 767.98px) {
		padding: 0.6em 2em;
	}

	@media (max-height:600.99px) {
		padding: 0.5em 2em;
	}

	@media (max-width:450.99px) {
		padding: 0.3em 2em;
	}

	&:focus {
		outline: none;
		transition: transform .15s ease;
		transform: scale(1.02);
		box-shadow: inset 2px 2px 10px rgb(23, 24, 24), inset -5px -5px 10px rgb(25, 33, 31);
		background: #fffffd;
	}

	&:hover {
		background: #fffffd;
	}

	&::placeholder {
		color: black;
		font-size: 1rem;
		opacity: 0.4;

		@media (max-width:767.98px) {
			font-size: 0.8rem;
		}
	}
}
</style>