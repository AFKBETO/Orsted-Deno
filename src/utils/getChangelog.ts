import * as path from '@std/path';
import { config } from '../../config/config.ts';
export async function getChangelog(): Promise<string> {
    const filePath = path.join(
        import.meta.dirname || '.',
        '../../CHANGELOG.md',
    );
    const changelog = await Deno.readTextFile(filePath);
    const changelogLines = changelog.split('\n');
    const version = config.version;
    let changeLogText = `Version ${version}\n` + '```md\n';
    let isNotCurrentVersion = true;
    for (const line of changelogLines) {
        if (line.startsWith(`## [${version}]`)) {
            isNotCurrentVersion = false;
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
