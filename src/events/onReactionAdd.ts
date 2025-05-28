import { MessageReaction, PartialMessageReaction } from 'discord.js';
import { getHosData } from '@orsted/utils/database';

const hosReactIcon = '814457607720796212';

export async function onReactionAdd(
    reaction: MessageReaction | PartialMessageReaction,
) {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error(
                'Something went wrong when fetching the message: ',
                error,
            );
            return;
        }
    }

    const hosData = await getHosData(reaction.message.id);

    if (hosData) {
        const hosEmoji = reaction.message.reactions.cache.get(hosReactIcon);
        if (hosEmoji) {
            hosData.reactCount = hosEmoji.count - 1;
            await hosData.save();
        }
    }
}
