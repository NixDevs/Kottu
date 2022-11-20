import type { ClientEvents } from 'discord.js';
import Kottu from '@struct/Kottu';

/**
 * Generic Event class which provides the structure for all events.
 *
 * @typeParam K - Key which must be one of the following event types: {@link https://discord.js.org/#/docs/discord.js/main/typedef/Events}
 */
export default class Event<K extends keyof ClientEvents> {
    public constructor(
        /** The event type */
        public event: K,

        /**
         * Handles all logic relating to event execution.
         *
         * @param client - The client to bind to the event
         * @param args - List of arguments for the event
         */
        public run: (
            kottu: Kottu,
            ...args: ClientEvents[K]
        ) => Promise<void> | void,
    ) {}
}
