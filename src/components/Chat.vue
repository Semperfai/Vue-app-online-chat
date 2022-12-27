<template >
	<div class="chat">
		<div class="chat__body">
			<nav class="chat__navigation">
				<div class="chat__profile">
					<div @click="toProfile" class="chat__profile-photo"><img :src="currentUserPhoto" alt="user"></div>
					<button type="button" class="chat__logout" @click="logOut">Logout</button>
				</div>
				<input v-model="searchQuery" type="text" class="chat__search" placeholder="Search">
				<ul class="chat__users">
					<transition-group name="post-list">
						<li class="chat__user" v-on:click="letsChat(item)" v-for="item in searchUserName" :key="item.id"
							v-show="item.id != currentUserId">
							<div class="chat__user-img">
								<img :src="item.URL" alt="user" />
							</div>
							<div class="chat__user-info">
								<p class="chat__user-name">{{ item.name }}</p>
								<div class="chat__user-online" :class="item.isOnline == 'online' ? 'online' : 'offline'">{{
		item.isOnline
}}</div>
							</div>
						</li>
					</transition-group>
				</ul>
			</nav>
			<transition name="mode-fade" mode="out-in">
				<div class="chat__content" id="content" v-if="currentPeerUser === null">
					<div class="chat__current-user-photo">
						<img :src="photoURL" />
					</div>
					<p class="chat__current-user-text"><i>Choose a user and start chatting right now. You can send messages
							andfiles, share news and makefriends!</i></p>
					<div>
						<h2 class="chat__current-user-title"><i>Welcome {{ currentUserName }}</i></h2>
					</div>
				</div>
				<ChatBox v-bind:currentPeerUser="currentPeerUser" v-else />
			</transition>
		</div>
	</div>
</template>
<script>
import ChatBox from '@/components/ChatBox.vue';
import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from '@/serviecs/firebase'
export default {
	components: {
		ChatBox
	},
	data() {
		return {
			currentUserName: localStorage.getItem("name"),
			currentPeerUser: null,
			currentUserId: localStorage.getItem("id"),
			currentUserPhoto: localStorage.getItem("photoURL"),
			searchUsers: [],
			photoURL: localStorage.getItem("photoURL"),
			searchQuery: ''
		}
	},
	methods: {
		toProfile() {
			this.$router.push('/profile')
		},
		logOut() {
			const auth = getAuth();
			signOut(auth).then(async () => {
				const cityRef = doc(db, 'users', localStorage.getItem('FirebaseDocumentId'));
				setDoc(cityRef, { isOnline: 'offline' }, { merge: true });
				setDoc(cityRef, { messagesCounter: localStorage.getItem('messagesCounter') }, { merge: true });
				this.$router.push('/');
				localStorage.clear()
			}).catch((error) => {
				console.log(error);
			});
		},
		letsChat(item) {
			this.currentPeerUser = item;
			console.log(this.currentPeerUser);
		},
		async getUserList() {
			const result = await getDocs(collection(db, "users"));
			if (result.docs.length > 0) {
				let listUsers = [];
				listUsers = [...result.docs];
				listUsers.forEach((item, index) => {
					this.searchUsers.push({
						key: index,
						documentKey: item.id,
						id: item.data().id,
						name: item.data().name,
						URL: item.data().URL,
						isOnline: item.data().isOnline,
						description: item.data().description
					})
				})
			}
		}
	},
	computed: {
		searchUserName() {
			return this.searchUsers.filter(user => user.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
		}
	},

	created() {
		if (!localStorage.hasOwnProperty('id')) this.$router.push('/')
		this.getUserList()
	}
}
</script>
<style lang="scss" >
$tablet: 991.98px;
$mobile: 767.98px;
$mobileSmall: 479.98px;

.chat {
	// .chat__name

	&__name {
		color: white;
	}

	// .chat__body

	&__body {
		display: flex;
		padding: 5em 2em;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;

		@media (max-width:$mobileSmall) {
			flex-direction: column;
			padding: 2em 1em;
		}
	}

	// .chat__navigation

	&__navigation {
		display: flex;
		flex-direction: column;
		flex: 0 1 15%;
		background: rgba(51, 50, 50, 0.5);
		padding: 10px;

		@media (max-width:$mobileSmall) {
			height: 300px;
		}

	}

	&__content {
		display: flex;
		padding: 2em 2em;
		flex-direction: column-reverse;
		justify-content: space-evenly;
		align-items: center;
		flex: 1 1 auto;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 0px 20px 20px 0px;

		@media (max-width:$mobile) {
			padding: 1em 1em;
		}

		@media (max-width:$mobileSmall) {
			border-radius: 0px 0px 22px 22px;
		}
	}

	// .chat__user

	&__profile {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 15px;
		padding: 10px 10px;
	}

	// .chat__user-photo

	&__profile-photo {
		width: 50px;
		height: 50px;

		img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			object-fit: cover;
			overflow: hidden;
		}
	}

	// .chat__logout

	&__logout {
		background: rgb(34, 36, 37);
		color: rgb(240, 246, 255);
		border-radius: 15px;
		padding: 5px 10px;
	}



	// .chat__search

	&__search {
		margin-bottom: 20px;
		background: rgb(250, 250, 250) url('@/assets/images/chat/Search.svg') no-repeat 95%;
		box-shadow: 0px 0px 1px 2px rgb(93, 96, 96);
		border-radius: 3px;
		padding: 5px;

	}

	&__search:focus {
		background: rgb(250, 250, 250);
		box-shadow: 0px 0px 1px 2px rgb(22, 144, 97);
	}

	// .chat__users

	&__users {
		display: flex;
		flex-direction: column;
		overflow: auto;
	}

	&__users::-webkit-scrollbar {
		width: 3px;
		border-radius: 5px;
		background: rgba(148, 144, 144, 0.5);
	}



	// .chat__active

	&__user {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 5px;
		padding-top: 10px;
		padding-left: 5px;
		padding-right: 15px;
		padding-bottom: 10px;
		margin-right: 2px;

		img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			object-fit: cover;
			overflow: hidden;
		}
	}

	&__user:not(:last-child) {
		margin-bottom: 5px;
	}

	&__user:hover {
		background: rgba(117, 113, 113, 0.5);
	}

	&__user-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	&__user-img {
		flex: 0 1 30%;
	}

	&__user-name {
		max-width: 100px;
		margin-left: 10px;
		flex: 0 1 30%;
		color: aliceblue;
		margin-bottom: 12px;
	}

	&__user-online {
		align-self: flex-end;
		flex: 0 1 20%;
		font-size: 15px;
	}


	// .chat__current-user-photo

	&__current-user-photo {
		height: 200px;
		width: 200px;

		@media (max-width:$mobile) {
			height: 120px;
			width: 120px;
		}

		img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			-o-object-fit: cover;
			object-fit: cover;
			overflow: hidden;

		}
	}

	// .chat__current-user

	&__current-user-title {
		color: rgb(241, 243, 242);
		font-size: 30px;
		margin-top: 0px;
		margin-bottom: 20px;
		animation: color-change-text 5s linear infinite alternate;

		@media (max-width:$mobile) {
			font-size: 20px;
		}
	}

	&__current-user-text {
		color: rgb(249, 255, 252);
		font-size: 18px;
		margin-bottom: 20px;
		text-align: center;

		@media (max-width:$mobile) {
			font-size: 12px;
		}
	}
}

@keyframes color-change-text {
	0% {
		color: #19dcea;
	}

	33.3333% {
		color: #b22cff;
	}

	66.666% {
		color: #ea2222;
	}

	100% {
		color: #f5be10;
	}
}

.online {
	color: rgb(43, 183, 43);
}

.offline {
	color: rgb(219, 31, 31);
}



.post-list-item {
	display: inline-block;
	margin-right: 10px;
}

.post-list-enter-active,
.post-list-leave-active {
	transition: all 0.4s ease;
}

.post-list-enter-from,
.post-list-leave-to {
	opacity: 0;
	transform: translateX(130px);
}

.post-list-move {
	transition: transform 0.4s ease;
}



.mode-fade-enter-active,
.mode-fade-leave-active {
	transition: opacity .5s ease
}

.mode-fade-enter-from,
.mode-fade-leave-to {
	opacity: 0
}
</style>