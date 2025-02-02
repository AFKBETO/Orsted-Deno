import { Interaction } from 'discord.js';
import { commands } from '@orsted/commands';

export async function onInteraction(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.find((cmd) =>
        cmd.data.name === interaction.commandName
    );

    if (!command) {
        console.error(`Command ${interaction.commandName} not found.`);
        return;
    }

    await command.execute(interaction);
}
