import { Message } from 'discord.js';
import { spoilerThreadHandler } from './messageChannelHandler/spoilerThreadHandler.ts';
import { messageEmbedHandler } from './messageChannelHandler/messageEmbedHandler.ts';
import { stickerHandler } from './messageChannelHandler/stickerHandler.ts';

const spoilerThreadId = '1156303744670105661';

export async function onMessageCreate(message: Message): Promise<void> {
    try {
        if (!message.inGuild()) {
            return;
        }
        if (message.channelId === spoilerThreadId) {
            await spoilerThreadHandler(message);
            return;
        }
        if (message.author.bot) {
            return;
        }
        if (message.stickers.size > 0) {
            const guildStickers = message.guild.stickers;
            const sticker = message.stickers.first();
            const isStickerInGuild = await guildStickers.fetch(sticker?.id);

            if (isStickerInGuild && !!sticker) {
                await stickerHandler(sticker);
            }
        }
        await messageEmbedHandler(message);
    } catch (error) {
        console.error('Error handling message:', error);
    }
}
