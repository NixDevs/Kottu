import { Command, Kottu } from '@struct';
import * as commands from '@commands/index';
import { Collection } from 'discord.js';
export default class CommandCollection extends Collection<string, Command> {
    public kottu: Kottu;
    constructor(kottu: Kottu) {
        super();
        this.kottu = kottu;
        this.loadCommands();
    }
    loadCommands() {
        const values = Object.values(commands);
        values.forEach((Command) => {
            if (Object.getPrototypeOf(Command).name !== 'Command') {
                return this.kottu.logger.warn(
                    '[CommandCollection] Skipping unknown command',
                );
            }
            const command = new Command(this.kottu);
            this.kottu.body.push({
                name: command.name,
                description: command.description,
                options: command.options ?? [],
            });
            this.set(command.name, command);
        });
        this.kottu.logger.info('Successfully loaded all commands!');
    }
}
