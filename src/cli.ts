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
        throw new Error(`Vysor binary was not found at ${vb}. Please install it from https://vysor.io/download`);
    }

    return new VysorBinary(vb);
}


async function main() {
    const vb = await findVysorBinary();
    vb.launch(...process.argv);

    process.exit();
}

main();
