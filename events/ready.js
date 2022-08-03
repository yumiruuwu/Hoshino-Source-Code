module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setActivity('Doujin Music', { type: 'LISTENING' });
		client.user.setStatus('online');
		console.log(`Đã sẵn sàng! Đã đăng nhập với tư cách ${client.user.tag}`);
	},
};