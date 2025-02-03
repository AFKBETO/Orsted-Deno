import { Interaction } from 'discord.js';
import { commands } from '@orsted/commands';
import { Collection } from 'discord.js';

const defaultCooldownDuration = 3;

export async function onInteraction(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.find((cmd) =>
        cmd.data.name === interaction.commandName
    );

    if (!command) {
        console.error(`Command ${interaction.commandName} not found.`);
        return;
    }

    const { cooldowns } = interaction.client;

    let timestamps = cooldowns.get(command.data.name);

    if (!timestamps) {
        timestamps = new Collection();
        cooldowns.set(command.data.name, timestamps);
    }

    const now = Date.now();
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) *
        1_000;
    const lastUse = timestamps.get(interaction.user.id) ?? 0;
    const expirationTime = lastUse + cooldownAmount;

    if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1_000);
        await interaction.reply({
            content:
                `Please wait, you are on a cooldown for '${command.data.name}'. You can use it again <t:${expiredTimestamp}:R>.`,
            ephemeral: true,
        });
        return;
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    await command.execute(interaction);
}
