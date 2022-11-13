import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    SlashCommandOptionsOnlyBuilder
} from 'discord.js';
import Base from './Base';
import {
    CommandType
} from './enums';
import Kottu from './Kottu';

interface CommandOptions {
    name: string,
        description: string,
        permissions ? : bigint[],
        type: CommandType,
        options ? : SlashCommandOptionsOnlyBuilder
}

export default class Command extends Base {

    public name: string;

    public description: string;

    public permissions: bigint[];

    public type: CommandType;
    constructor(kottu: Kottu, {
        name,
        description,
        permissions = [PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.ViewChannel],
        type = CommandType.Misc
    }: CommandOptions) {
        super(kottu);
        this.name = name;
        this.description = description;
        this.permissions = permissions;
        this.type = type;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public execute(interaction: ChatInputCommandInteraction) {
        return Promise.resolve();
    }
}