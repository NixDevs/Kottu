import { Kottu, Module } from '@struct';
import {
    ChatInputCommandInteraction,
    Interaction,
    TextChannel,
} from 'discord.js';
import { ButtonCustomIds } from 'enums';
import { ITabooCard } from 'types';
//import { ITabooGame } from 'types';
import Taboo from './Taboo';

export default class TabooModule extends Module {
    public module: string;
    public friendlyName: string;
    public games: Record<string, Taboo>;
    constructor(kottu: Kottu) {
        super(kottu);
        this.module = 'taboo';
        this.games = {};
    }
    start(interaction: ChatInputCommandInteraction<'cached'>) {
        if (this.games[interaction.guild.id])
            return Promise.resolve('A game already exists on this channel!');
        this.games[interaction.guild.id] = new Taboo(
            this,
            this.kottu,
            interaction.channel as TextChannel,
        );
        return Promise.resolve('Starting game...');
    }
    interactionCreate(interaction: Interaction) {
        if (!interaction.inCachedGuild()) return;
        if (!interaction.isButton()) return;
        if (interaction.customId !== ButtonCustomIds.TABOO_ENTRY) return;
        return this.games[interaction.guild.id].interactionHandler(
            interaction.user,
        );
    }
    getCard(): ITabooCard {
        return { word: '', banned: [''] };
    }
}
