import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, Message, PermissionFlagsBits } from 'discord.js';

const twitterRegex =
    /(https:\/\/)(www\.){0,1}(x|twitter)\.com\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)$/g;

const redditRegex =
    /(https:\/\/)((www|old)\.){0,1}reddit\.com\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)$/g;

export async function messageEmbedHandler(message: Message): Promise<void> {
    try {
        const { client } = message;
        if (!client.botConfig) {
            throw new Error('Client botConfig is not initialized');
        }
        const twitterEmbedLinks = client.botConfig.twitterEmbedLinks;
        if (!twitterEmbedLinks) {
            throw new Error('Twitter embed links not found in bot config');
        }
        const messageContent = message.content;

        const twitterLink = messageContent.match(twitterRegex);
        const redditLink = messageContent.match(redditRegex);
        if (redditLink === null && twitterLink === null) {
            return;
        }

        let newLink = '';

        if (twitterLink) {
            const linkString = twitterLink[0];
            const newEmbedLink = twitterEmbedLinks.randomItem();
            newLink = linkString.replace(
                /(www\.){0,1}(x|twitter)\.com/,
                newEmbedLink,
            );
        }
        if (redditLink) {
            const linkString = redditLink[0];
            newLink = linkString.replace('reddit.com', 'rxddit.com');
        }
		const row = new ActionRowBuilder<ButtonBuilder>();
		const deleteButton = new ButtonBuilder()
			.setCustomId('delete')
			.setLabel('Delete')
			.setStyle(ButtonStyle.Danger);
		row.addComponents(deleteButton);
		const components: ActionRowBuilder<ButtonBuilder>[] = [row];
        const newEmbedMsg = await message.reply({
            content: newLink,
            allowedMentions: { repliedUser: false },
			components: components,
        });
		const collector = newEmbedMsg.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 600000,
		});
		collector.on('collect', async (buttonInteraction: ButtonInteraction) => {
			if (buttonInteraction.user.id !== message.author.id && !buttonInteraction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) {
				await buttonInteraction.reply({
					content: 'Only the original message\'s author can use this button.',
					ephemeral: true,
				});
				return;
			}
			if (buttonInteraction.customId === 'delete') {
				collector.stop();
				await newEmbedMsg.delete();
			}
		});
		await message.suppressEmbeds(true);
    } catch (error) {
        console.error(new Date(), 'Error in twitterEmbedHandler:', error);
    }
}
