import { Base, Kottu } from '@struct';
import { Guild, TextChannel } from 'discord.js';
import { ITabooPlayerData } from 'types';

export default class Taboo extends Base {
    public channel: TextChannel;
    public guild: Guild;
    public players: ITabooPlayerData[];
    public index: number;
    constructor(kottu: Kottu, channel: TextChannel) {
        super(kottu);
        this.channel = channel;
        this.guild = this.channel.guild;
        this.players = [];
        this.index = 0;
    }
}
