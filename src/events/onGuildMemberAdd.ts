import { Client, EmbedBuilder, GuildMember, TextChannel } from 'discord.js';
import { createInviteData } from '@orsted/utils/database';

export async function onGuildMemberAdd(client: Client, member: GuildMember) {
    const guild = member.guild;

    const invites = await guild.invites.fetch();

    const invite = invites.find((invite) =>
        invite.uses !== 0 && invite.maxUses === 0 && invite.maxAge !== 0
    );
    if (invite === undefined) return;

    const user = await guild.members.fetch(invite.inviterId!);

    const result = await createInviteData(invite.code, user.id, member.id);
    const logChannel = await client.channels.fetch(
        client.botConfig.logsId,
    ) as TextChannel;
    if (result === null) {
        await logChannel.send(
            `Invite ${invite.code} cannot be updated on database`,
        );
    }

    const logEmbed = new EmbedBuilder()
        .setAuthor({
            name: user.displayName,
            iconURL: user.user.displayAvatarURL(),
        })
        .setDescription(
            `${user} invited ${member} to the server using code ${invite.code}.`,
        )
        .setTimestamp(Date.now());

    await logChannel.send({ embeds: [logEmbed] });

    const councilChannel = await client.channels.fetch(
        client.botConfig.councilId,
    ) as TextChannel;
    const councilEmbed = new EmbedBuilder()
        .setAuthor({
            name: user.displayName,
            iconURL: user.user.displayAvatarURL(),
        })
        .setDescription(`${user} invited ${member} to the ORSTED Corporation.`)
        .setTimestamp(Date.now());
    const message = await councilChannel.send({ embeds: [councilEmbed] });
    await message.startThread({
        name: `${user.displayName} invited ${member.displayName}`,
    });
    await invite.delete(
        `Invite from ${user.displayName} is used by ${member.displayName}`,
    );
}
