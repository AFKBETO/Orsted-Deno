import { Client, Collection, REST, Routes, TextChannel } from 'discord.js';
import { config } from '../../config/config.ts';
import { commands, generateAnimeCommands } from '@orsted/commands';
import { getAnimeData, updateVersion } from '@orsted/utils/database';
import { getChangelog } from '../tools/getChangelog.ts';

export async function onReady(client: Client): Promise<void> {
    try {
        client.cooldowns = new Collection();

        const { botDevId, looperId, changelogChannelId } = client.botConfig;

        client.commands = commands.clone();

        const animeList = await getAnimeData();
        console.log('generate commands for anime:');
        for (const animeCommand of generateAnimeCommands(animeList)) {
            console.log(animeCommand.data.name);
            client.commands.set(animeCommand.data.name, animeCommand);
        }

        const commandData = [
            ...client.commands.values(),
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

        if (client.botConfig.version !== config.version) {
            const changelogText = await getChangelog();
            if (config.environment === 'production') {
                const changelogChannel = client.channels.cache.get(
                    changelogChannelId,
                ) as TextChannel;

                await changelogChannel.send(changelogText);
                await updateVersion(config.version);
            } else {
                const changelogChannel = client.channels.cache.get(
                    botDevId,
                ) as TextChannel;
                await changelogChannel.send(changelogText);
            }
        }
    } catch (error) {
        console.error(error);
    }
}
