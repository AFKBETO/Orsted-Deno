import { Message } from 'discord.js';
import { spoilerThreadHandler } from './messageChannelHandler/spoilerThreadHandler.ts';
import { messageEmbedHandler } from './messageChannelHandler/messageEmbedHandler.ts';

const spoilerThreadId = '1156303744670105661';

export async function onMessageCreate(message: Message): Promise<void> {
    try {
        if (message.channelId === spoilerThreadId) {
            await spoilerThreadHandler(message);
            return;
        }
        if (message.author.bot) {
            return;
        }
        await messageEmbedHandler(message);
    } catch (error) {
        console.error('Error handling message:', error);
    }
}
