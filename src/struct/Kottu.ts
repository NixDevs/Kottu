import {
    Client,
    type ClientOptions,
    GatewayIntentBits,
    type RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes,
    REST,
    Collection,
} from 'discord.js';
import Table from 'cli-table3';
import Command from '@struct/Command';
interface Config {
    clientId: string | undefined;
    token: string | undefined;
    ownerId: string | undefined;
    bugReportId: string | undefined;
    production: boolean | undefined;
    guildId: string | undefined;
}
import { join, resolve } from 'path';
import logger from '../transports/winston';
import { Logger } from 'winston';
import { readdirSync } from 'fs';
import Module from './Module';
//import Event from 'struct/Event';

const styling: Table.TableConstructorOptions = {
    chars: {
        mid: '',
        'left-mid': '',
        'mid-mid': '',
        'right-mid': '',
    },
    style: {
        head: ['yellow'],
    },
};
export default class Kottu {
    public client: Client;
    public clientId: string | undefined;
    public logger: Logger;
    private token: string | undefined;
    public readonly ownerId: string | undefined;
    public readonly guildId: string | undefined;
    public readonly bugReportId: string | undefined;
    public readonly production: boolean | undefined;
    public readonly clientOptions: ClientOptions;
    private body: RESTPostAPIChatInputApplicationCommandsJSONBody[];
    public commands: Collection<string, Command>;
    public modules: Collection<string, Module>;

    constructor({
        clientId,
        token,
        ownerId,
        bugReportId,
        production,
        guildId,
    }: Config) {
        this.clientId = clientId;
        this.token = token;
        this.ownerId = ownerId;
        this.bugReportId = bugReportId;
        this.production = production;
        this.guildId = guildId;
        this.logger = logger;
        this.commands = new Collection();
    }
    /**
     * initiate client
     * @returns {ThisType}
     */
    initiate() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildPresences,
            ],
        });
        this.loadApplicationCommands().loadCommands().loadEvents();
        //.loadModules()
        this.client.login(this.token);
        return this;
    }
    /**
     * Loads all slash commands using REST API
     * @returns {ThisType} `this`
     */
    public loadApplicationCommands() {
        async () => {
            const applicationCommands =
                this.production === true
                    ? Routes.applicationCommands(this.clientId ?? '')
                    : Routes.applicationGuildCommands(
                          this.clientId ?? '',
                          this.guildId ?? '',
                      );
            try {
                const rest = new REST({
                    version: '10',
                }).setToken(this.token ?? '');
                await rest.put(applicationCommands, {
                    body: this.body,
                });
            } catch (err) {
                if (err instanceof Error) this.logger.error(err.stack);
                else this.logger.error(err);
            }
        };
        return this;
    }
    /**
     * loads commands to collection
     * @returns {ThisType} this
     */
    public loadCommands() {
        this.logger.info('Loading commands...');
        const table = new Table({
            head: ['File', 'Name', 'Type', 'Status'],
            ...styling,
        });
        const commandFolders = readdirSync(join('./src/commands/')).filter(
            (f) => !f.endsWith('.ts'),
        );
        if (commandFolders.length === 0) this.logger.warn('No commands found!');
        commandFolders.forEach((dir) => {
            const commands = readdirSync(resolve(join('./src/commands/', dir)));
            console.log(commands);
            commands.forEach(async (cmd) => {
                const CommandClass = (
                    await import(join('../commands', dir, cmd))
                ).default;
                const command = new CommandClass(this);
                if (command.name) {
                    console.log(command.name);
                    table.push([cmd, command.name, command.type, 'pass']);
                    this.commands.set(command.name, command);
                }
            });
        });
        this.logger.info(`\n${table.toString()}`);
        this.logger.info('loaded commands...');
        return this;
    }
    /**
     * loads client events
     * @returns {ThisType}
     */
    public loadEvents() {
        this.logger.info('Loading events...');
        const table = new Table({
            head: ['File', 'Name', 'Status'],
            ...styling,
        });
        const events = readdirSync('./src/events').filter((f) =>
            f.endsWith('.ts'),
        );
        if (events.length === 0) this.logger.warn('No modules found!');
        events.forEach(async (f) => {
            const event = (await import(`../events/${f}`)).default;
            this.client.on(event.event, event.run.bind(null, this));
            table.push([f, f.substring(0, f.lastIndexOf('.')), '✅']);
        });
        this.logger.info(`\n${table.toString()}`);
        return this;
    }
    /**
     * loads modules
     * @returns {ThisType}
     */
    public loadModules() {
        this.logger.info('Loading events...');
        const table = new Table({
            head: ['File', 'Name', 'Status'],
            ...styling,
        });
        const modules = readdirSync('./src/modules');
        if (modules.length === 0) return this.logger.warn('No modules found!');
        modules.forEach(async (dir) => {
            const file = (await import(join('./src/modules', dir, 'index.ts')))
                .default;
            const module = new file(this);
            file.registerEvents();
            this.commands.set(module.name, module);
        });
        this.logger.info(`\n${table.toString()}`);
        return this;
    }
}
