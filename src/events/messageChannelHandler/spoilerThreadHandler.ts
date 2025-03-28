import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ComponentType,
    Message,
    MessageFlags,
    ModalBuilder,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle,
    ThreadChannel,
    User,
} from 'discord.js';
import { Utils } from '@orsted/utils';

const BOT_MESSAGE_DELETE_AFTER_IN_MS = 10 * 60 * 1000;

async function onCollectButton(
	interaction: ButtonInteraction,
	thread: ThreadChannel,
	user: User,
) {
	try {
		if (interaction.user.id !== user.id) {
			interaction.reply({
				content: `Only the OP ${user} can change this thread's settings`,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		if (interaction.customId === 'delete') {
			await interaction.channel?.delete();
		} else if (interaction.customId === 'rename') {
			const modal = new ModalBuilder().setCustomId('renameModal').setTitle(
				'Rename Thread',
			);

			const nameInput = new TextInputBuilder().setCustomId('newName')
			.setLabel('Input your new thread name').setStyle(
				TextInputStyle.Short,
			).setRequired(true).setValue(thread.name);

			const nameInputRow = new ActionRowBuilder<TextInputBuilder>()
			.addComponents(nameInput);

			modal.addComponents(nameInputRow);

			await interaction.showModal(modal);

			const modalSubmit = await interaction.awaitModalSubmit({
				time: BOT_MESSAGE_DELETE_AFTER_IN_MS,
			});
			const newName = modalSubmit.fields.getTextInputValue('newName');
			await thread.setName(newName);
			await modalSubmit.reply({
				content: 'Thread name updated!',
				ephemeral: true,
			});
		}
	}
	catch (error) {
		console.error('Error handling button interaction', error);
	}

}

async function createThreadForSeries(message: Message) {
	const hasEmbed = message.embeds.length > 0;

	let name = `${message.author.displayName}'s Link`;
	let topic = `${message.content}`;
	if (hasEmbed) {
		name = message.embeds[0].title ?? name;
		topic = message.embeds[0].title ?? topic;
	}

	const thread = await message.startThread({
		name: name,
		autoArchiveDuration: 1440,
		reason: 'Auto create thread',
	});

	const renameButton = new ButtonBuilder().setCustomId('rename').setLabel(
		'Rename',
	).setStyle(ButtonStyle.Primary).setEmoji('823978760860598382');

	const deleteButton = new ButtonBuilder().setCustomId('delete').setLabel(
		'Delete',
	).setStyle(ButtonStyle.Secondary).setEmoji('904933664100581436');

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
		renameButton,
		deleteButton,
	);

	const botMessage = await thread.send({
		content:
		`A thread has been created to discuss about ${topic}. You can choose the buttons below to rename or delete this thread during the next 10 minutes.`,
		components: [row],
	});

	const collector = botMessage.createMessageComponentCollector({
		componentType: ComponentType.Button,
	});

	collector.on(
		'collect',
		async (interaction) =>
			await onCollectButton(interaction, thread, message.author),
	);

	setTimeout(async () => {
		await botMessage.delete();
	}, BOT_MESSAGE_DELETE_AFTER_IN_MS);

}

export async function spoilerThreadHandler(message: Message) {
	const isAuthorNotMod = !message.member?.permissions.has(
		PermissionFlagsBits.ManageChannels,
	);

	if (!Utils.isValidURL(message.content) && isAuthorNotMod) {
		await message.author.send(
			`Hey ${message.author.username}, please only post links in the spoiler channel.\nI have deleted your message.\nThank you!`,
		);
		await message.delete();
		return;
	}
	setTimeout(async () => await createThreadForSeries(message), 3000);
}
