import { Guild, Invite, PermissionFlagsBits } from 'discord.js';

export async function onInviteCreate(invite: Invite): Promise<void> {
    if (invite.inviterId === null) {
        return;
    }
    const guildMember = await (invite.guild as Guild).members.fetch(
        invite.inviterId,
    );
    if (guildMember.permissions.has(PermissionFlagsBits.ManageGuild)) {
        return;
    }
    if (invite.maxUses !== 0) {
        await guildMember.send(
            'You are not allowed to create invite with limited uses.',
        );
        await invite.delete();
        return;
    }
    if (invite.maxAge === 0) {
        await guildMember.send(
            'You are not allowed to create invite with limited expiration time. Please contact the server owner if you need one.',
        );
        await invite.delete();
        return;
    }
}
