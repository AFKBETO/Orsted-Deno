import { Message } from 'discord.js';
const twitterRegex =
    /(http(s):\/\/)(www\.){0,1}(x|twitter)\.com\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g;
export async function twitterEmbedHandler(message: Message): Promise<void> {
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
        if (!twitterLink) {
            return;
        }
        const twitterLinkString = twitterLink[0];
        const twitterEmbedLink = twitterEmbedLinks.randomItem();
        const newLink = twitterLinkString.replace(
            /(www\.){0,1}(x|twitter)\.com/,
            twitterEmbedLink,
        );
        await message.reply({
            content: newLink,
            allowedMentions: { repliedUser: false },
        });
        await message.suppressEmbeds(true);
    } catch (error) {
        console.error(new Date(), 'Error in twitterEmbedHandler:', error);
    }
}
