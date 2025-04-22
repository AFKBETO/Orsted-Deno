import { config } from '../../config/config.ts';
export async function getChangelog(): Promise<string> {
    const changelog = await Deno.readTextFile('../../CHANGELOG.md');
    const changelogLines = changelog.split('\n');
    const version = config.version;
    let changeLogText = `Version ${version}\n` + '```md\n';
    let isNotCurrentVersion = false;
    for (const line of changelogLines) {
        if (line.startsWith(`## [${version}]`)) {
            isNotCurrentVersion = true;
        } else if (isNotCurrentVersion) {
            continue;
        } else if (line.startsWith('## [')) {
            break;
        } else {
            changeLogText += `${line}\n`;
        }
    }
    changeLogText += '```';
    return changeLogText;
}
