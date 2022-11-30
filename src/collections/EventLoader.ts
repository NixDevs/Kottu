import { Command, Kottu } from '@struct';
import { Collection } from 'discord.js';
import * as events from '../events';
export default class EventCollection extends Collection<string, Command> {
    public kottu: Kottu;
    constructor(kottu: Kottu) {
        super();
        this.kottu = kottu;
        this.loadCommands();
    }
    loadCommands() {
        const values = Object.values(events);
        values.forEach((event) => {
            this.kottu.client.on(event.event, (...args) =>
                event.run(this.kottu, ...(args as never)),
            );
            this.kottu.logger.info(
                `[Event] loaded ${event.event.toString()} event`,
            );
        });
        return this;
    }
}
