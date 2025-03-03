import { Interaction, InteractionType } from 'discord.js';
import {
    messageContextCommands,
    slashCommands,
    userContextCommands,
} from '@orsted/commands';

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

    let cooldownAmount = 0;

    if (interaction.isChatInputCommand()) {
        const command = slashCommands.get(interaction.commandName);
        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`,
            );
            return;
        }
        cooldownAmount = command.cooldown ?? defaultCooldownDuration;
        await command.execute(interaction);
    }

    if (interaction.isMessageContextMenuCommand()) {
        const command = messageContextCommands.get(interaction.commandName);
        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`,
            );
            return;
        }
        cooldownAmount = command.cooldown ?? defaultCooldownDuration;
        await command.execute(interaction);
    }

    if (interaction.isUserContextMenuCommand()) {
        const command = userContextCommands.get(interaction.commandName);
        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`,
            );
            return;
        }
        cooldownAmount = command.cooldown ?? defaultCooldownDuration;
        await command.execute(interaction);
    }

    const cooldownTimestamp = now + cooldownAmount * 1_000;

    timestamps.set(interaction.user.id, cooldownTimestamp);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
}
