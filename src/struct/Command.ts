import {
    ChatInputCommandInteraction,
    SlashCommandOptionsOnlyBuilder,
} from 'discord.js';
import Base from './Base';
import { CommandType, PermissionLevel } from './enums';
import Kottu from './Kottu';

interface CommandOptions {
    name: string;
    description: string;
    permissions?: PermissionLevel;
    type: CommandType;
    options?: SlashCommandOptionsOnlyBuilder;
}

export default class Command extends Base {
    /**
     * the command name
     */
    public name: string;
    /**
     * the command description
     */
    public description: string;
    /**
     * the command perms
     */
    public permissions: PermissionLevel;
    /**
     * the command type
     */
    public type: CommandType;
    constructor(
        kottu: Kottu,
        {
            name,
            description,
            permissions = PermissionLevel.Public,
            type = CommandType.Misc,
        }: CommandOptions,
    ) {
        super(kottu);
        this.name = name;
        this.description = description;
        this.permissions = permissions;
        this.type = type;
    }
    /**
     * Fall back execute command
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public execute(interaction: ChatInputCommandInteraction) {
        return Promise.resolve();
    }
}
