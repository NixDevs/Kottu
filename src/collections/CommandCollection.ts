import { Base, Kottu } from '@struct';
import * as commands from '@commands/index';
export default class CommandCollection extends Base {
    constructor(kottu: Kottu) {
        super(kottu);
        this.loadCommands();
    }
    loadCommands() {
        const values = Object.values(commands);
        values.forEach((Command) => {
            if (Object.getPrototypeOf(Command).name !== 'Command') {
                return this.logger.warn(
                    '[CommandCollection] Skipping unknown command',
                );
            }
            const command = new Command(this.kottu);
            this.kottu.commands.set(command.name, command);
        });
        this.logger.info('Successfully loaded all commands!');
    }
}
