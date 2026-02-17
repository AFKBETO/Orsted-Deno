import { Message, MessageReaction, PartialMessageReaction, PartialUser, User } from 'discord.js';
import { updateHosData } from '@orsted/utils/database';
import { config } from '../../config/config.ts';

const hosReactIcon = '814457607720796212';

export async function onReaction(
    reactionPartial: MessageReaction | PartialMessageReaction,
	userPartial: User | PartialUser,
) {
	let reaction: MessageReaction;
    if (reactionPartial.partial) {
        try {
			reaction = await reactionPartial.fetch();
        } catch (error) {
            console.error(
                'Something went wrong when fetching the message: ',
                error,
            );
            return;
        }
    } else {
		reaction = reactionPartial;
	}
	if (!reaction.message.inGuild()) {
		return;
	}
	if (reaction.message.guildId !== config.guild_id) {
		return;
	}
	let user: User;
	if (userPartial.partial) {
		try {
			user = await userPartial.fetch();
		} catch (error) {
			console.error(
				'Something went wrong when fetching the user: ',
				error,
			);
			return;
		}
	} else {
		user = userPartial;
	}
	if (user.bot) {
		return;
	}
	if (reaction.emoji.id === hosReactIcon) {
		await updateHosData(reaction.message.id, reaction.count);
	}
	if (reaction.emoji.name === '🗑️') {
		if (reaction.count <= 1 || reaction.users.cache.filter((u) => u.bot).size === 0) {
			return;
		}
		const message = reaction.message;
		if (!message.author.bot) {
			return;
		}
		let originalMsg: Message | null = null;
		try {
			originalMsg = await message.fetchReference();
		} catch {
		}
		const member = await message.guild?.members.fetch(user.id);
		if ((!!originalMsg && originalMsg.author.id !== user.id) && !member?.permissions.has('ManageMessages')) {
			return;
		}
		await message.delete();
	}
}
