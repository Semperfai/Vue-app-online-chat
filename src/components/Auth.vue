<template>
	<div class="auth">
		<video autoplay muted loop id="myVideo">
			<source src="@/assets/videos/decor2.mp4" type="video/mp4">
		</video>
		<h1 class="auth__title title"><i>Welcome <span>to</span> our <span>truth</span> chat</i></h1>
		<form class="auth__form form">
			<h4 class="form__subtitle">Signup to Chat</h4>
			<my-input type=" text" v-model="name" placeholder="Enter your name..." />
			<my-input type="text" v-model="email" placeholder="Enter your email..." />
			<my-input type="password" v-model="password" class="form__password" placeholder="Enter your password..." />
			<div :class="{ 'errors': v$.$errors.length > 0 }">
				<div v-for="error of v$.$errors" :key="error.$uid">{{ error.$message }}</div>
			</div>
			<div class="errors" v-if="errorMessages.existence">{{ errorMessages.errorText }}</div>
			<router-link class="form__link" :to="{ path: '/' }">
				Back to login
			</router-link>
			<button type="button" @click="signUp" class="form__btn">Signup</button>
		</form>
	</div>
</template>
<script>
import Decor from '@/components/Decor';
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import { collection, addDoc } from "firebase/firestore";
import { db } from '@/serviecs/firebase'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import MyInput from '@/components/UI/MyInput';
export default {
	components: {
		MyInput, Decor
	},
	setup() {
		return { v$: useVuelidate() }
	},
	data() {
		return {
			name: '',
			password: '',
			email: '',
			errorMessages: {
				errorText: '',
				existence: null
			}
		}
	},
	validations() {
		return {
			name: { required, minLength: minLength(3) },
			password: { required, minLength: minLength(3) },
			email: { required, email }
		}
	},
	methods: {
		async signUp() {
			const isFormCorrect = await this.v$.$validate()
			if (!isFormCorrect) return
			let name = this.name;
			let password = this.password;
			let email = this.email
			const auth = getAuth();
			createUserWithEmailAndPassword(auth, email, password)
				.then(async (userCredential) => {
					const user = userCredential.user;
					const userDoc = await addDoc(collection(db, "users"), {
						name,
						id: user.uid,
						email,
						password,
						URL: "",
						description: "",
						isOnline: 'online'
					}).then(ref => {
						console.log(ref);
						localStorage.setItem('id', user.uid);
						localStorage.setItem('name', name);
						localStorage.setItem('email', email);
						localStorage.setItem('password', password);
						localStorage.setItem('photoURL', "");
						localStorage.setItem('description', "");
						localStorage.setItem('FirebaseDocumentId', ref.id);
						this.name = "";
						this.password = "";
						this.email = "";
						this.$router.push('/profile')
					}).catch(error => console.log(error));
				}).catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					if (errorCode) {
						this.errorMessages.errorText = errorMessage.split(':').slice(1).join()
						this.errorMessages.existence = true
						setTimeout(() => {
							this.errorMessages.existence = false;
							this.errorMessages.errorText = '';
						}, 4000)
					}
				});
		},
	},
	computed: {
	}
}
</script>
<style lang="scss">
.auth {

	video,
	iframe,
	object,
	embed {
		position: fixed;
		top: 50%;
		left: 50%;
		min-width: 100%;
		min-height: 100%;
		width: auto;
		height: auto;
		z-index: -100;
		transform: translateX(-50%) translateY(-50%);
		background-size: cover;
	}
}
</style>