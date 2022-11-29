import {
    ApplicationCommandOption,
    ChatInputCommandInteraction,
    InteractionResponse,
} from 'discord.js';
import Base from './Base';
import { CommandType, PermissionLevel } from '../enums';
import Kottu from '@struct/Kottu';

interface CommandOptions {
    name: string;
    description: string;
    permissions?: PermissionLevel;
    type?: CommandType;
    options?: ApplicationCommandOption[];
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
     * @param interaction the slash command interaction
     */
    public execute(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        interaction: ChatInputCommandInteraction,
    ): Promise<InteractionResponse | void> {
        return Promise.resolve();
    }
    /**
     * Returns member and user from interaction member option
     * @param interaction the slash command interaction
     * @param option the name for the member option
     */
    public getMember(
        interaction: ChatInputCommandInteraction,
        option = 'member',
    ) {
        if (!interaction.inCachedGuild()) return { target: null, member: null };
        const member = interaction.options.getMember(option);
        if (!member)
            return { target: interaction.member, member: interaction.member };
        else return { target: member, member: interaction.member };
    }
}
