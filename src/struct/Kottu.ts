import { 
    Client, 
    type ClientOptions,
    GatewayIntentBits,
    type RESTPostAPIChatInputApplicationCommandsJSONBody, 
    Routes,
    REST, Collection
} from 'discord.js';
import Table from 'cli-table3';
import Command from './Command';
interface Config {
    clientId: string,
    token: string,
    ownerIds: string[],
    bugReportId: string,
    production: boolean,
    clientOptions: ClientOptions,
    betaGuildId: string
}
import logger from '../transports/winston';
import { Logger } from 'winston';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        clientOptions,
        betaGuildId
    }: Config) {
        this.clientId = clientId;
        this.token = token;
        this.ownerIds = ownerIds;
        this.bugReportId = bugReportId;
        this.production = production;
        this.clientOptions = clientOptions;
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
}


