import { Interaction, InteractionType } from 'discord.js';
import {
    isMessageContextMenuCommand,
    isSlashCommand,
    isUserContextMenuCommand,
} from '@orsted/utils';
const defaultCooldownDuration = 3;
export async function onInteraction(interaction: Interaction): Promise<void> {
    if (interaction.type !== InteractionType.ApplicationCommand) {
        return;
    }
    const {
        cooldowns,
        commands,
    } = interaction.client;
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
    const command = commands.get(interaction.commandName);
    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`,
        );
        return;
    }
    const isInteractionSlashCommand = isSlashCommand(command) &&
        interaction.isChatInputCommand();
    if (isInteractionSlashCommand) {
        await command.execute(interaction);
    }
    const isInteractionUserCommand = isUserContextMenuCommand(command) &&
        interaction.isUserContextMenuCommand();
    if (isInteractionUserCommand) {
        await command.execute(interaction);
    }
    const isInteractionMessageCommand = isMessageContextMenuCommand(command) &&
        interaction.isMessageContextMenuCommand();
    if (isInteractionMessageCommand) {
        await command.execute(interaction);
    }
    cooldownAmount = command.cooldown ?? defaultCooldownDuration;
    const cooldownTimestamp = now + cooldownAmount * 1_000;
    timestamps.set(interaction.user.id, cooldownTimestamp);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
}
