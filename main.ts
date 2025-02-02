import { Client, Events } from 'discord.js';
import { config } from './config/config.ts';
import { intents } from './config/intentOptions.ts';
import { partials } from './config/partialOptions.ts';
import { onReady } from './src/events/onReady.ts';

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
    const client = new Client({ intents: intents, partials: partials });

    client.once(Events.ClientReady, onReady);

    client.login(config.bot_token);
}
