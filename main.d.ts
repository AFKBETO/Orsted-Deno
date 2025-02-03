import { Collection } from 'discord.js';

declare module 'discord.js' {
    interface Client {
        cooldowns: Collection<string, Collection<string, number>>;
    }
}
