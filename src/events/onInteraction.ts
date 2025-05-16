import { Interaction, InteractionType } from 'discord.js';
import { Utils } from '@orsted/utils';

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
    const isSlashCommand = Utils.isSlashCommand(command) &&
        interaction.isChatInputCommand();
    if (isSlashCommand) {
        await command.execute(interaction);
    }
    const isUserCommand = Utils.isUserContextMenuCommand(command) &&
        interaction.isUserContextMenuCommand();
    if (isUserCommand) {
        await command.execute(interaction);
    }
    const isMessageCommand = Utils.isMessageContextMenuCommand(command) &&
        interaction.isMessageContextMenuCommand();
    if (isMessageCommand) {
        await command.execute(interaction);
    }

    cooldownAmount = command.cooldown ?? defaultCooldownDuration;
    const cooldownTimestamp = now + cooldownAmount * 1_000;

    timestamps.set(interaction.user.id, cooldownTimestamp);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
}
