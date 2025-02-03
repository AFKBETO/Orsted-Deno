import { Client, REST, Routes, TextChannel } from 'discord.js';
import { config } from '../../config/config.ts';
import { channels, commands } from '@orsted/commands';
import { Collection } from 'discord.js';

export async function onReady(client: Client): Promise<void> {
    try {
        client.cooldowns = new Collection();

        const { botDevId, looperId } = channels;
        const rest = new REST().setToken(config.bot_token);
        await rest.put(
            Routes.applicationGuildCommands(
                client.user?.id || 'missing_id',
                config.guild_id,
            ),
            { body: commands.map((command) => command.data.toJSON()) },
        );

        console.log('Discord ready!');
        if (config.environment === 'production') {
            await (client.channels.cache.get(looperId) as TextChannel).send(
                `${client.user} has started another loop!`,
            );
        } else {
            await (client.channels.cache.get(botDevId) as TextChannel).send(
                `${client.user} has started another experiment!`,
            );
        }
    } catch (error) {
        console.error(error);
    }
}
