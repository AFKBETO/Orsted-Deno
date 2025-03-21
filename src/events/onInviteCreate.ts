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
}
