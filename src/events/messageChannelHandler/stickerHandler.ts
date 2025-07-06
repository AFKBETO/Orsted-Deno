import { Sticker } from 'discord.js';
import { updateStickerUsage } from '@orsted/utils/database';
export async function stickerHandler(sticker: Sticker): Promise<void> {
    try {
        await updateStickerUsage(sticker);
        return;
    } catch (error) {
        console.error(new Date(), 'Error in stickerHandler:', error);
    }
}
