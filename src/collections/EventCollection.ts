import { Base, Kottu } from '@struct';
import * as events from '../events';
export default class EventCollection extends Base {
    constructor(kottu: Kottu) {
        super(kottu);
    }
    loadCommands() {
        const values = Object.values(events);
        values.forEach((event) => {
            this.client.on(event.event, (...args) =>
                event.run(this.kottu, ...(args as never)),
            );
            this.logger.info(`[Event] loaded ${event.event.toString()} event`);
        });
    }
}
