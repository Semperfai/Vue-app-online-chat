<template >
	<div class="profile">
		<h2 class="profile__title title">Create your Profile!</h2>
		<div class="profile__body">
			<div class="profile__decor">
				<img class="profile__photo" :src="photoURL" />
				<label class="profile__avatar">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="25px" height="25px">
						<path
							d="M 79.335938 15.667969 C 78.064453 15.622266 76.775 15.762109 75.5 16.099609 C 72.1 16.999609 69.299609 19.199219 67.599609 22.199219 L 64 28.699219 C 63.2 30.099219 63.699609 32.000781 65.099609 32.800781 L 82.400391 42.800781 C 82.900391 43.100781 83.400391 43.199219 83.900391 43.199219 C 84.200391 43.199219 84.399219 43.199609 84.699219 43.099609 C 85.499219 42.899609 86.1 42.399219 86.5 41.699219 L 90.199219 35.199219 C 91.899219 32.199219 92.4 28.700781 91.5 25.300781 C 90.6 21.900781 88.400391 19.100391 85.400391 17.400391 C 83.525391 16.337891 81.455078 15.744141 79.335938 15.667969 z M 60.097656 38.126953 C 59.128906 38.201172 58.199219 38.724609 57.699219 39.599609 L 27.5 92 C 24.1 97.8 22.200781 104.30039 21.800781 110.90039 L 21 123.80078 C 20.9 124.90078 21.5 125.99961 22.5 126.59961 C 23 126.89961 23.5 127 24 127 C 24.6 127 25.199219 126.8 25.699219 126.5 L 36.5 119.40039 C 42 115.70039 46.7 110.8 50 105 L 80.300781 52.599609 C 81.100781 51.199609 80.599219 49.3 79.199219 48.5 C 77.799219 47.7 75.899609 48.199609 75.099609 49.599609 L 44.800781 102 C 41.900781 106.9 37.899609 111.20039 33.099609 114.40039 L 27.300781 118.19922 L 27.699219 111.30078 C 27.999219 105.60078 29.699609 100 32.599609 95 L 62.900391 42.599609 C 63.700391 41.199609 63.200781 39.3 61.800781 38.5 C 61.275781 38.2 60.678906 38.082422 60.097656 38.126953 z M 49 121 C 47.3 121 46 122.3 46 124 C 46 125.7 47.3 127 49 127 L 89 127 C 90.7 127 92 125.7 92 124 C 92 122.3 90.7 121 89 121 L 49 121 z M 104 121 A 3 3 0 0 0 101 124 A 3 3 0 0 0 104 127 A 3 3 0 0 0 107 124 A 3 3 0 0 0 104 121 z" />
					</svg>
					<input type="file" name="upload" class="profile__file" @change="changeAvatar" />
				</label>
			</div>
			<div class="profile__form">
				<label><i>Name</i></label>
				<my-input type="text" name="name" class="profile__form-control" v-model="name" />
			</div>
			<div class="profile__form">
				<label><i>Tell me about yourself</i></label>
				<my-input type="text" name="aboutMe" class="profile__form-control" v-model="aboutMe" />
			</div>
			<div class="profile__btns">
				<button type="button" class="profile__btn-upload" v-on:click="uploadAvatar">Save</button>
				<button type="button" class="profile__btn-back" v-on:click="goBack">Back</button>
			</div>
		</div>
	</div>
</template>
<script>
import MyInput from './UI/MyInput.vue'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { firebase } from '@/serviecs/firebase'
import { db } from '@/serviecs/firebase'
export default {
	components: { MyInput },
	data() {
		return {
			firebaseDocId: localStorage.getItem('FirebaseDocumentId'),
			id: localStorage.getItem('id'),
			name: localStorage.hasOwnProperty('name') ? localStorage.getItem('name') : '',
			aboutMe: localStorage.hasOwnProperty('description') ? localStorage.getItem('description') : '',
			photoURL: localStorage.getItem('photoURL'),
			newPhoto: null
		}
	},
	methods: {
		goBack() {
			this.$router.push('/chat')
		},
		changeAvatar(event) {
			// console.log(event.target.files[0].type.toString().indexOf('image'));
			if (event.target.files && event.target.files[0]) {
				let fileType = event.target.files[0].type.toString();
				if (fileType.indexOf('image') != 0) {
					console.log('pls choose an image');
					return
				}
				this.newPhoto = event.target.files[0];
				this.photoURL = URL.createObjectURL(event.target.files[0])
			} else {
				console.log('wrong');
			}
		},
		uploadAvatar() {
			if (this.photoURL) {
				const storage = getStorage(firebase);
				const storageRef = ref(storage, this.id);
				const uploadTask = uploadBytesResumable(storageRef, this.newPhoto);
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						const progress = Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100
						);
						console.log(progress);
					},
					(error) => {
						console.log(error);
					},
					async () => {
						const url = await getDownloadURL(storageRef)
						console.log(url);
						this.updateUserInfo(true, url)
						this.$router.push('/chat')
						setTimeout(() => location.reload(), 0)
					}
				)
			}
			else {
				this.updateUserInfo(false, null)
			}
		},
		async updateUserInfo(isUrlPresent, downloadURL) {
			let newInfo = {};
			if (isUrlPresent) {
				newInfo = {
					name: this.name,
					description: this.aboutMe,
					URL: downloadURL
				};
			} else {
				newInfo = {
					name: this.name,
					description: this.aboutMe
				};
			}
			const usersRef = doc(db, 'users', this.firebaseDocId);
			await updateDoc(usersRef, newInfo).then(res => {
				localStorage.setItem('name', this.name)
				localStorage.setItem('description', this.aboutMe);
				if (isUrlPresent) {
					localStorage.setItem('photoURL', downloadURL);
				}
			})
		}
	},
	created() {
		if (!localStorage.hasOwnProperty("id")) this.$router.push("/");
	}
}
</script>
<style lang="scss" scoped>
$tablet: 991.98px;
$mobile: 767.98px;
$mobileSmall: 479.98px;

.profile {


	label {
		font-size: 2em;
		color: rgb(252, 255, 255);
		font-weight: bold;

		@media (max-width:$mobile) {
			font-size: 1.5em;
		}

		@media (max-width:$mobileSmall) {
			font-size: 1em;
		}

	}

	&__title {
		margin-bottom: 0px;
	}

	&__body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 30px;
		padding: 40px;
		border-radius: 30px;
		background-size: 600%;
	}

	&__decor {
		width: 120px;
		height: 120px;
		position: relative;
		border-radius: 0.6rem;
	}

	&__photo {
		height: 100%;
		width: 100%;
		border-radius: 50%;
		object-fit: cover;
		background: rgb(3, 2, 2);
	}

	// .profile__avatar

	&__avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border-radius: 0.6rem;
		position: absolute;
		right: 0;
		bottom: 0;
		background: white;
	}

	// .profile__file

	&__file {
		width: 0;
	}

	// .profile__form

	&__form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 30px;
	}

	// .profile__form-control

	&__form-control {}

	&__btns {
		@media (max-width:$mobileSmall) {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 20px;
		}
	}

	// .profile__btn-upload

	&__btn-upload {
		background: blue;
		border-radius: 20px;
		line-height: 30px;
		padding: 0px 30px;
		color: rgb(221, 205, 28);

		font-weight: 900;
	}

	&__btn-upload:active {
		position: relative;
		top: -3px;
		left: -3px;
		box-shadow: 2px 2px 2px 0px rgb(19, 21, 29);
	}

	&__btn-upload:hover {
		background: yellow;
		color: rgb(38, 28, 221);
	}

	// .profile__btn-back

	&__btn-back {
		background: yellow;
		border-radius: 20px;
		line-height: 30px;
		padding: 0px 30px;
		color: blue;
		font-weight: 900;
		margin-left: 30px;

		@media (max-width:$mobileSmall) {
			margin-left: 0px;
		}
	}

	&__btn-back:active {
		position: relative;
		top: -3px;
		left: -3px;
		box-shadow: 2px 2px 2px 0px rgb(19, 21, 29);
	}

	&__btn-back:hover {
		background: blue;
		color: rgb(229, 255, 0);
	}

	@keyframes gradient {
		0% {
			background-position: 80% 0%;
		}

		50% {
			background-position: 20% 100%;
		}

		100% {
			background-position: 80% 0%;
		}
	}
}
</style>