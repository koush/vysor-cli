import path from "path";
import fs from "fs";
import child_process from "child_process";
import util from "util";

const exec = util.promisify(child_process.exec);
const spawn = util.promisify(child_process.spawn);

function getUserHome(): string {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']!;
}

class VysorBinary {
    vb: string;
    constructor(vb: string) {
        this.vb = vb;
    }

    launch(...argv: string[]): void {
        let launchCommand: string;
        let launchArgs: string[] = [];

        if (process.platform === 'win32') {
            launchCommand = this.vb;
        }
        else if (process.platform === 'darwin') {
            launchCommand = this.vb;
        }
        else if (process.platform === 'linux') {
            launchCommand = 'gtk-launch';
            launchArgs.push(this.vb);
        }
        else {
            throw new Error('unknown platform');
        }

        launchArgs.push('--args', ...argv)

        spawn(launchCommand, launchArgs, {
            detached: true,
        })
    }
}

async function findVysorBinary(): Promise<VysorBinary> {
    let vb: string|undefined;
    if (process.platform === 'win32') {
        vb = path.join(getUserHome(), 'Local/Vysor/Vysor.exe');
    }
    else if (process.platform === 'darwin') {
        vb = '/Applications/Vysor.app/Contents/MacOS/Vysor';
    }
    else if (process.platform === 'linux') {
        vb = (await exec('which vysorapp')).stdout.trim();
    }
    else {
        throw new Error('unknown platform');
    }

    if (!fs.existsSync(vb)) {
        console.error(`Vysor binary was not found at ${vb}.`);
        console.error(`Please install it from https://vysor.io/download`);
        process.exit(1);
    }

    return new VysorBinary(vb);
}


async function main() {
    const vb = await findVysorBinary();
    const argv = process.argv.slice();

    for (const arg of argv) {
        if (arg === '-h' || arg === '-?') {
            console.error(
`usage: vysor [options]

The following basic options are available:

-h or -?    Show this usage.

-l          Open the list of Vysor devices
-d          View all physical devices
-e          View all emulators
-s [serial] View device with the given [serial] number.

The following advanced options are available:

-i [id]     Some devices have multiple displays. The default behavior is
            to view the default display. This option overrides
            which display will be viewed. More information below:
            DisplayManager.getDisplays: https://bit.ly/3d07Ztl
            Display.getDisplayId: https://bit.ly/3j8cN3A

If no options are specified, Vysor will be launched as normal.
`);
            return;
        }
    }

    vb.launch('--', ...process.argv);
    process.exit();
}

main();
