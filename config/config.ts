export const config = {
    mongo_uri: Deno.env.get('ORSTED_MONGO_URI') || '',
    bot_token: Deno.env.get('ORSTED_BOT_TOKEN') || '',
    guild_id: Deno.env.get('ORSTED_GUILD_ID') || '',
    environment: Deno.env.get('ORSTED_ENVIRONMENT') || 'development',
};
