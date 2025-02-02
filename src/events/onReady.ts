import { Client, REST, Routes, TextChannel } from 'discord.js';
import { config } from '../../config/config.ts';
import { botDevId, looperId } from '../../config/channels.ts';


export async function onReady(client: Client): Promise<void> {
	try {
		const rest = new REST().setToken(config.bot_token);
		await rest.put(
			Routes.applicationGuildCommands(client.user?.id || 'missing_id', config.guild_id),
			{ body: [] },
		);

		console.log('Discord ready!');
		if (config.environment === 'production') {
			await (client.channels.cache.get(looperId) as TextChannel).send(`${client.user} has started another loop!`);
		} else {
			await (client.channels.cache.get(botDevId) as TextChannel).send(`${client.user} has started another experiment!`);
		}
	} catch (error) {
		console.error(error);
	}
}
