import { PermissionsBitField } from 'discord.js';
import Base from './Base';
import { CommandType } from './enums';
import Kottu from './Kottu';

interface CommandOptions {
    name: string,
    description: string,
    permissions?: bigint[],
    type: CommandType
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
    public execute(): TypeError{
        throw new TypeError('No execute function >:(');
    }
}