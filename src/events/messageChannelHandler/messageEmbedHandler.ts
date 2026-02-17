import { Message } from 'discord.js';

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
        const newEmbedMsg = await message.reply({
            content: newLink,
            allowedMentions: { repliedUser: false },
        });
		let counter = 0;
		const interval = setInterval(async() => {
			const embeds = (await newEmbedMsg.fetch()).embeds;
			if (embeds.length > 0) {
				await message.suppressEmbeds(true);
				await newEmbedMsg.react('🗑️');
				clearInterval(interval);
			} else {
				counter++;
				if (counter >= 25) {
					await newEmbedMsg.delete();
					clearInterval(interval);
				}
			}
		}, 200);
    } catch (error) {
        console.error(new Date(), 'Error in twitterEmbedHandler:', error);
    }
}
