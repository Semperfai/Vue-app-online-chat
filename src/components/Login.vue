<template >
	<div class="login">
		<video autoplay muted loop id="myVideo">
			<source src="@/assets/videos/decor2.mp4" type="video/mp4">
		</video>
		<h2 class="login__title title"><i>Welcome <span>to</span> our <span>truth</span> chat</i></h2>
		<p class="login__subtitle subtitle"><i>only relevant news from reliable sources</i></p>
		<form class="login__form form">
			<h4 class="form__subtitle">Login to Chat</h4>
			<my-input type="email" v-model="email" placeholder="Enter your email..." />
			<my-input type="password" v-model="password" placeholder="Enter your password..." v-on:keyup.enter="logIn" />
			<div class="errors" v-if="errorMessages.existence">{{ errorMessages.errorText }}</div>
			<router-link class="form__link" :to="{ path: 'auth' }">
				<h6>Create an account</h6>
			</router-link>
			<button type="button" v-on:click="logIn" class="form__btn">Login</button>
		</form>
	</div>
</template>
<script>
import MyInput from './UI/MyInput.vue'
import { db } from '@/serviecs/firebase'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
export default {
	components: { MyInput },
	data() {
		return {
			email: '',
			password: '',
			errorMessages: {
				errorText: '',
				existence: null
			}
		}
	},
	methods: {
		logIn() {
			const auth = getAuth();
			signInWithEmailAndPassword(auth, this.email, this.password)
				.then(async (userCredential) => {
					if (userCredential) {
						const user = userCredential.user;
						const q = query(collection(db, "users"), where("id", "==", user.uid));
						await getDocs(q).then(querySnapshot => {
							querySnapshot.forEach((doc) => {
								let userData = doc.data();
								localStorage.setItem('id', userData.id);
								localStorage.setItem('name', userData.name);
								localStorage.setItem('email', userData.email);
								localStorage.setItem('password', userData.password);
								localStorage.setItem('photoURL', userData.URL);
								localStorage.setItem('description', userData.description);
								localStorage.setItem('FirebaseDocumentId', doc.id);
							});
						});
						const cityRef = doc(db, 'users', localStorage.getItem('FirebaseDocumentId'));
						await setDoc(cityRef, { isOnline: 'online' }, { merge: true });
						this.$router.push('/chat')
						setTimeout(() => location.reload(), 0)
					}
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					if (errorCode) {
						this.errorMessages.errorText = errorMessage.split(':').slice(1).join()
						this.errorMessages.existence = true
						setTimeout(() => {
							this.errorMessages.existence = false;
							this.errorMessages.errorText = '';
						}, 3000)
					}
				});
		}
	},
	created() {
		if (localStorage.getItem('id')) this.$router.push('/chat')
	}



}
</script>
<style lang="scss" scoped>
.login {

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