import { 
    Client, 
    type ClientOptions,
    GatewayIntentBits,
    type RESTPostAPIChatInputApplicationCommandsJSONBody, 
    Routes,
    REST, Collection, ClientEvents
} from 'discord.js';
import Table from 'cli-table3';
import Command from './Command';
interface Config {
    clientId: string,
    token: string,
    ownerIds: string[],
    bugReportId: string,
    production: boolean,
    betaGuildId: string
}
import logger from '../transports/winston';
import { Logger } from 'winston';
import { readdirSync } from 'fs';
import Event from 'struct/Event';
export interface StructureModule<
  Structure extends Command | Event<keyof ClientEvents>,
> {
  default: Structure
}

const styling: Table.TableConstructorOptions = {
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
    style: {
        head: ['yellow'],
    },
};
export default class Kottu {
    public client: Client;
    public clientId: string;
    public logger: Logger;
    private token:string; 
    public readonly ownerIds: string[];
    public readonly betaGuildId: string;

    public readonly bugReportId: string; 
    public readonly production: boolean;
    public readonly clientOptions: ClientOptions;
    private body: RESTPostAPIChatInputApplicationCommandsJSONBody[];
    public commands: Collection<string, Command>;
    constructor({
        clientId,
        token,
        ownerIds,
        bugReportId,
        production,
        betaGuildId
    }: Config) {
        this.clientId = clientId;
        this.token = token;
        this.ownerIds = ownerIds;
        this.bugReportId = bugReportId;
        this.production = production;
        this.betaGuildId = betaGuildId;
        this.logger = logger;
    }
    initiate() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds, 
                GatewayIntentBits.GuildMessages, 
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers, 
                GatewayIntentBits.GuildPresences,
            ]
        });	
        this.client.login(this.token);
        return this;        
    }
    
    public loadApplicationCommands() {
        (async ()=> {
            const applicationCommands = this.production === true ? Routes.applicationCommands(this.clientId) : Routes.applicationGuildCommands(this.clientId, this.betaGuildId);
            try {
                const rest = new REST({ version: '10' }).setToken(this.token);
                await rest.put(applicationCommands, { body: this.body });
            } catch(err) {
                if (err instanceof Error) this.logger.error(err.stack);
                else this.logger.error(err);
            }
        });
        return this;
    }
    public loadCommands() {
        this.logger.info('Loading commands...');
        const table = new Table({
            head: ['File', 'Name', 'Type', 'Status'],
            ...styling,
        });
        readdirSync('../commands').filter(f=>!f.endsWith('.ts'))
            .forEach(dir=> {
                const commands = readdirSync('../commands/'+dir);
                commands.forEach(async command=> {
                    const Command = (await import(command) as StructureModule<Command>).default;
                    if (Command.name) {
                        this.commands.set(Command.name, Command);
                        table.push([command, Command.name, Command.type, '✅']);
                    }
                });
            });
        this.logger.info(`\n${table.toString()}`);
        return this;
    }
    public registerEvents() {
        this.logger.info('Loading events...');
        const table = new Table({
            head: ['File', 'Name', 'Status'],
            ...styling,
        });
        readdirSync('../events').filter(f=>f.endsWith('.ts'))
            .forEach(async f=> {
                const event = (await import(f) as StructureModule<Event<keyof ClientEvents>>).default;
                this.client.on(event.event, event.run.bind(null, this));
                table.push([f, f.substring(0, f.lastIndexOf('.')), '✅']);
            });
        return this;
    }

}


