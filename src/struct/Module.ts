import Base from './Base';
import Kottu from './Kottu';
export default class Module extends Base {
    public name: string;
    public events: string[];
    public games: Record<string, unknown>;
    constructor(kottu: Kottu) {
        super(kottu);
        
        this.name = this.constructor.name;

        this.events = ['messageCreate', 'interactionCreate'];

        this.games = {};

    }
    /**
     * Register events in module
     */
    registerEvents(): void {
        this.events.forEach(event=> {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const eventFn = this[event];
            if (event) {
                this.client.on(event, eventFn.bind(this));
            }
        });
    }
}