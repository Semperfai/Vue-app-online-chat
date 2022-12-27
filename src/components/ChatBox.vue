<template>
	<div class="chat-box">
		<header class="chat-box__header">
			<div class="chat-box__peer-user-img">
				<img :src="currentPeerUser.URL" />
			</div>
			<h6 class="chat-box__peer-user-name">{{ currentPeerUser.name }}</h6>
		</header>
		<main class="chat-box__main">
			<div ref="scroll" class="chat-box__text-outer">
				<transition-group name="list">
					<div class="chat-box__message" v-for="item in listMessage" :key="item.id"
						:class="item.idFrom === currentUserId ? 'textFrom' : 'textTo'">
						<div class="chat-box__message-content">
							<i>{{ item.content }}</i>
						</div>
						<div class="chat-box__message-time">{{ item.messageTime }}</div>
					</div>
				</transition-group>
			</div>
		</main>
		<footer class="chat-box__footer">
			<div class="chat-box__message-body">
				<input class="chat-box__message-text" type="text" v-model="inputValue"
					v-on:keyup.enter="sendMessage(inputValue)" />
				<svg viewBox="0 0 19 19" fill="currentColor" v-on:click="sendMessage(inputValue)"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M10.2131 9.67239L3.62263 10.7714C3.54686 10.784 3.47575 10.8164 3.41646 10.8652C3.35717 10.9141 3.31179 10.9777 3.28488 11.0496L1.0125 17.137C0.795501 17.697 1.38088 18.2308 1.91813 17.9621L17.6681 10.0871C17.7772 10.0327 17.869 9.94888 17.9331 9.84517C17.9972 9.74147 18.0312 9.62195 18.0312 9.50001C18.0312 9.37808 17.9972 9.25856 17.9331 9.15485C17.869 9.05115 17.7772 8.96736 17.6681 8.91289L1.91813 1.03789C1.38088 0.769262 0.795501 1.30389 1.0125 1.86301L3.28575 7.95039C3.31254 8.0225 3.35787 8.08627 3.41717 8.13528C3.47646 8.18428 3.54763 8.21679 3.6235 8.22951L10.214 9.32764C10.2546 9.33474 10.2913 9.35592 10.3178 9.38745C10.3443 9.41898 10.3588 9.45884 10.3588 9.50001C10.3588 9.54119 10.3443 9.58105 10.3178 9.61257C10.2913 9.6441 10.2546 9.66528 10.214 9.67239H10.2131Z" />
				</svg>
			</div>
		</footer>
	</div>
</template>
<script>
import moment from 'moment';
import { db } from '@/serviecs/firebase';
import { doc, setDoc, onSnapshot, query, collection } from "firebase/firestore";
export default {
	name: "ChatBox",
	props: ["currentPeerUser"],
	data() {
		return {
			currentUserName: localStorage.getItem("name"),
			currentUserId: localStorage.getItem("id"),
			currentUserPhoto: localStorage.getItem("photoURL"),
			inputValue: "",
			photoURL: localStorage.getItem("photoURL"),
			listMessage: [],
			groupChatId: null
		};
	},
	watch: {
		currentPeerUser: function (newVal, oldVal) {
			if (newVal != oldVal) {
				this.getMessages()
			}
		}
	},
	methods: {
		async sendMessage(content) {
			if (content.trim() === '') return
			const timestamp = moment().valueOf().toString();
			let date = new Date(moment())
			let messageTime = `${date.getHours()}:${date.getMinutes()}`
			const message = {
				id: timestamp,
				idFrom: this.currentUserId,
				idTo: this.currentPeerUser.id,
				timestamp: timestamp,
				content: content.trim(),
				messageTime
			};
			let scrollTo = this.$refs.scroll.lastElementChild
			const messageRef = doc(db, "Messages", this.groupChatId, this.groupChatId, timestamp);
			await setDoc(doc(db, "Messages", this.groupChatId, this.groupChatId, timestamp), message).then(() => {
				this.inputValue = ""
				scrollTo.scrollIntoView({ block: "center", behavior: "smooth" })
			});
		},
		getMessages() {
			this.listMessage = [];
			let groupChatId = `${this.currentPeerUser.id} + ${this.currentUserId}`;
			const q = query(collection(db, "Messages", groupChatId, groupChatId))
			onSnapshot(q, (snapshot) => {
				if (snapshot.docChanges().length > 0) {
					this.groupChatId = groupChatId
					snapshot.docChanges().forEach(res => {
						this.listMessage.push(res.doc.data())
					})
				} else {
					this.groupChatId = `${this.currentUserId} + ${this.currentPeerUser.id}`;
					const q = query(collection(db, "Messages", this.groupChatId, this.groupChatId))
					onSnapshot(q, (snapshot) => {
						snapshot.docChanges().forEach(res => {
							if (res.type === "added") {
								this.listMessage.push(res.doc.data())
								localStorage.setItem('messagesCounter', this.listMessage.length)
							}
						})
					})
				}
			})
		}
	},
	computed: {
	},
	mounted() {
		this.getMessages()
	}

}
</script>
<style lang="scss" scoped>
$tablet: 991.98px;
$mobile: 767.98px;
$mobileSmall: 479.98px;

.chat-box {
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	background: rgba(0, 0, 0, 0.1);

	@media (max-width:$mobile) {}

	@media (max-width:$mobileSmall) {}

	// .chat-box__header


	&__header {
		display: flex;
		margin-bottom: 20px;
		padding: 10px;
		border-radius: 8px;
		background: linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f6f63c);
	}

	// .chat-box__peer-user-img

	&__peer-user-img {
		height: 40px;
		width: 40px;

		img {
			border-radius: 50%;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	// .chat-box__peer-user-name

	&__peer-user-name {
		margin-left: 20px;
		font-size: 20px;
		font-weight: bold;
	}

	// .chat-box__main

	&__main {
		padding: 20px;
		flex: 1 1 auto;
		overflow: auto;

		@media (max-width:$mobileSmall) {
			max-height: 300px;
		}
	}

	&__main::-webkit-scrollbar {
		width: 3px;
		border-radius: 5px;
		background: rgba(148, 144, 144, 0.5);
	}

	// .chat-box__text-outer

	&__text-outer {
		display: flex;
		flex-direction: column;
	}

	&__message {
		display: flex;
		align-items: flex-end;
		margin-bottom: 9px;
	}

	&__message-time {
		margin-left: 5px;
		font-size: 11px;

		@media (max-width:$mobileSmall) {
			font-size: 9px;
		}
	}

	// .chat-box__footer

	&__footer {
		padding: 20px;
	}

	// .chat-box__message-body

	&__message-body {
		display: flex;
		align-items: center;
		justify-content: center;

		svg {
			width: 45px;
			height: 45px;
			color: rgba(231, 222, 56);

			@media (max-width:$mobile) {
				width: 35px;
				height: 35px;
			}
		}
	}

	// .chat-box__message-text

	&__message-text {
		background: rgb(250, 250, 250);
		box-shadow: 0px 0px 1px 2px rgb(93, 96, 96);
		font-size: 25px;
		border-radius: 3px;
		padding: 7px;
		flex: 1 1 auto;
		margin-right: 10px;

		@media (max-width:$mobile) {
			font-size: 18px;
			padding: 5px;
		}
	}

	&__message-text:focus {
		background: rgb(250, 250, 250);
		box-shadow: 0px 0px 1px 1.5px rgba(150, 121, 16, 1);
	}
}

.textFrom {
	align-self: flex-end;
	padding: 10px;
	font-size: 30px;
	border-radius: 8px;
	background: rgb(255, 250, 150);

	@media (max-width:$mobile) {
		font-size: 17px;
	}

}

.textTo {
	align-self: flex-start;
	padding: 10px;
	font-size: 30px;
	border-radius: 8px;
	background: rgb(143, 236, 255);

	@media (max-width:$mobile) {
		font-size: 17px;
	}
}

.list-enter-active,
.list-leave-active {
	transition: all 1s ease;
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateY(30px);
}
</style>