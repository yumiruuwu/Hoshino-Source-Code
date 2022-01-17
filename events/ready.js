module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setActivity('Eternal House', { type: 'STREAMING', url: 'https://www.twitch.tv/discord' });
		client.user.setStatus('online');
		console.log(`Đã sẵn sàng! Đã đăng nhập với tư cách ${client.user.tag}`);
	},
};