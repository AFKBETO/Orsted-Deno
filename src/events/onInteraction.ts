import { Collection, Interaction, InteractionType } from 'discord.js';
import {
    messageContextCommands,
    slashCommands,
    userContextCommands,
} from '@orsted/commands';
import { BotCommand } from '@orsted/utils';

const defaultCooldownDuration = 3;

export async function onInteraction(interaction: Interaction): Promise<void> {
    if (interaction.type !== InteractionType.ApplicationCommand) {
        return;
    }
    const { cooldowns } = interaction.client;

    const timestamps = cooldowns.get(interaction.commandName);

    if (!timestamps) {
        throw new Error(`Command ${interaction.commandName} not found.`);
    }

    const now = Date.now();
    const expirationTime = timestamps.get(interaction.user.id) ?? 0;
    if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1_000);
        await interaction.reply({
            content:
                `Please wait, you are on a cooldown for '${interaction.commandName}'. You can use it again <t:${expiredTimestamp}:R>.`,
            ephemeral: true,
        });
        return;
    }

    const commandList: Collection<string, BotCommand> =
        interaction.isChatInputCommand()
            ? slashCommands
            : (interaction.isUserContextMenuCommand()
                ? userContextCommands
                : messageContextCommands);

    const command = commandList.find((cmd) =>
        cmd.data.name === interaction.commandName
    );

    if (!command) {
        throw new Error(`Command ${interaction.commandName} not found.`);
    }
    await command.execute(interaction);
    const cooldownAmount = command.cooldown ?? defaultCooldownDuration;
    const cooldownTimestamp = now + cooldownAmount * 1_000;

    timestamps.set(interaction.user.id, cooldownTimestamp);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
}
