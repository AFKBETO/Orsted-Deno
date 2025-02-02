export const config = {
    mongo_uri: Deno.env.get('MONGO_URI') || '',
    bot_token: Deno.env.get('BOT_TOKEN') || '',
    guild_id: Deno.env.get('GUILD_ID') || '',
	environment: Deno.env.get('ENVIRONMENT') || 'development',
};
