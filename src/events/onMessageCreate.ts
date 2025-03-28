import { Message } from 'discord.js';
import { spoilerThreadHandler } from './messageChannelHandler/spoilerThreadHandler.ts';

const spoilerThreadId = '1156303744670105661';

export async function onMessageCreate(message: Message): Promise<void> {
    if (message.channelId === spoilerThreadId) {
        await spoilerThreadHandler(message);
    }
}
