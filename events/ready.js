module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setPresence({
			activities: [{ 
				name: "Doujin Music",
				type: "LISTENING"
			}],
			status: "online"
		})
		console.log(`Đã sẵn sàng! Đã đăng nhập với tư cách ${client.user.tag}`);
	},
};