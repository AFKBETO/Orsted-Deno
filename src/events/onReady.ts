import { Client, REST, Routes, TextChannel } from 'discord.js';
import { config } from '../../config/config.ts';
import {
    generateAnimeCommands,
    messageContextCommands,
    slashCommands,
    userContextCommands,
} from '@orsted/commands';
import { Collection } from 'discord.js';
import { getAnimeData } from '@orsted/utils';

export async function onReady(client: Client): Promise<void> {
    try {
        client.cooldowns = new Collection();

        const { botDevId, looperId } = client.botConfig;

        client.slashCommands = slashCommands.clone();
        client.userContextCommands = userContextCommands.clone();
        client.messageContextCommands = messageContextCommands.clone();

        const animeList = await getAnimeData();
        console.log('generate commands for anime:');
        for (const animeCommand of generateAnimeCommands(animeList)) {
            console.log(animeCommand.data.name);
            client.slashCommands.set(animeCommand.data.name, animeCommand);
        }

        const commandData = [
            ...client.slashCommands.values(),
            ...client.userContextCommands.values(),
            ...client.messageContextCommands.values(),
        ];

        const rest = new REST().setToken(config.bot_token);
        await rest.put(
            Routes.applicationCommands(client.user?.id || 'missing_id'),
            { body: [] },
        );
        await rest.put(
            Routes.applicationGuildCommands(
                client.user?.id || 'missing_id',
                config.guild_id,
            ),
            {
                body: commandData.map((command) => {
                    client.cooldowns.set(command.data.name, new Collection());
                    return command.data.toJSON();
                }),
            },
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
