import { Base, Kottu } from '@struct';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    Interaction,
    StringSelectMenuBuilder,
    TextChannel,
} from 'discord.js';
import CardsAgainstHumanityModule from '.';
import decks from 'assets/decks.json';
import { ICardsAgainstHumanityPlayerData } from 'types';
import { ButtonCustomIds, Color } from 'enums';
import { stripIndents } from 'common-tags';
type packName = 'dad' | 'geek' | 'base' | 'family';

type deck = typeof decks[packName];

export default class CAH extends Base {
    public pack: string;
    public module: CardsAgainstHumanityModule;
    public deck: deck;
    public playerDeckSize: number;
    public channel: TextChannel;
    public players: ICardsAgainstHumanityPlayerData[];
    public open: boolean;
    public card: string;
    constructor(
        module: CardsAgainstHumanityModule,
        kottu: Kottu,
        channel: TextChannel,
        pack: packName,
    ) {
        super(kottu);
        this.pack = pack;
        this.module = module;
        this.deck = decks[pack];
        this.playerDeckSize = 7;
        this.players = [];
        this.channel = channel;
        this.open = false;
        this.card = this.getBlackCard();
        this.entryForm();
    }
    getPlayer(id: string): ICardsAgainstHumanityPlayerData {
        return this.players.find(
            (p) => p.id === id,
        ) as ICardsAgainstHumanityPlayerData;
    }
    getPlayerIndex(id: string): number {
        return this.players.indexOf(this.getPlayer(id));
    }
    getWhiteCard(): string {
        return this.randomElement(this.deck.white).text;
    }
    getBlackCard(): string {
        return this.randomElement(this.deck.black.filter((b) => b.pick === 0))
            .text;
    }
    setPlayerDeck(id: string): void {
        const index = this.getPlayerIndex(id);
        const playerData = this.getPlayer(id);
        const array: string[] = [];
        for (let i = 0; i < this.playerDeckSize; i++) {
            array.push(this.getWhiteCard());
        }
        playerData.choices = array;
        this.players[index] = playerData;
    }
    formatSelectMenu(id: string) {
        const row =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(ButtonCustomIds.CAH_SUBMIT_MENU)
                    .setPlaceholder('Nothing selected...')
                    .addOptions(
                        this.getPlayer(id).choices.map((c) => {
                            return {
                                label: c,
                                description: '-',
                                value: c,
                            };
                        }),
                    ),
            );
        return row;
    }
    async entryForm() {
        const embed = new EmbedBuilder()
            .setTitle('A new game of Cards Against Humanity has started')
            .setColor(Color.Blue).setDescription(stripIndents`
            Welcome to cards against humanity! Complete the sentence in the weirdest way possible.
            `);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('ENTER')
                .setCustomId(ButtonCustomIds.CAH_ENTRY)
                .setStyle(ButtonStyle.Success),
        );
        const rowDisabled = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('ENTER')
                .setCustomId(ButtonCustomIds.CAH_ENTRY)
                .setStyle(ButtonStyle.Success),
        );

        const message = await this.channel.send({
            embeds: [embed],
            components: [row],
        });
        setTimeout(() => {
            message.edit({ components: [rowDisabled] });
            if (this.players.length < 2) return;
        });
    }

    interactionHandler(interaction: Interaction<'cached'>) {
        const player = this.getPlayer(interaction.user.id);
        const index = this.getPlayerIndex(interaction.user.id);
        if (interaction.isButton()) {
            if (interaction.customId === ButtonCustomIds.CAH_SUBMIT_BUTTON) {
                if (!this.open)
                    return interaction.reply({
                        content: 'Submissions are closed!',
                        ephemeral: true,
                    });
                const row = this.formatSelectMenu(interaction.user.id);
                interaction.reply({
                    content: 'Make a choice!',
                    components: [row],
                    ephemeral: true,
                });
            }
            if (interaction.customId === ButtonCustomIds.CAH_VOTE_BUTTON) {
                interaction.customId.slice(
                    ButtonCustomIds.CAH_VOTE_BUTTON.length,
                );
                const num = parseInt(interaction.customId);
                const players = this.players.filter((p) => p.submission);
                const player = players[num - 1];
                if (player.id === interaction.user.id) {
                    return interaction.reply({
                        content: 'Cannot vote for yourself!',
                        ephemeral: true,
                    });
                }
            }
        }
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId !== ButtonCustomIds.CAH_SUBMIT_MENU)
                return;
            if (!this.open)
                return interaction.reply({
                    content: 'Submissions are closed!',
                    ephemeral: true,
                });
            const value = interaction.values[0];
            player.submission = value;
            this.players[index] = player;
            interaction.reply({
                content: `Set your choice to: ${value}`,
                ephemeral: true,
            });
        }
    }
    async voteProcess() {
        this.open = false;
        const players = this.players.filter((p) => p.submission);
        const buttonChunks = this.chunk(players, 5);
        const rows: ActionRowBuilder<ButtonBuilder>[] = [];
        let i = 1;
        buttonChunks.forEach((c) => {
            const row = new ActionRowBuilder<ButtonBuilder>();
            c.forEach(() => {
                const button = new ButtonBuilder()
                    .setCustomId(
                        `${ButtonCustomIds.CAH_VOTE_BUTTON} ${i.toString()}`,
                    )
                    .setLabel(i.toString())
                    .setStyle(ButtonStyle.Primary);
                row.addComponents(button);
                i++;
            });
            rows.push(row);
        });
        const list = players.map((p, i) => {
            return `${i + 1} | ${p.submission}`;
        });
        const embed = new EmbedBuilder()
            .setColor(Color.White)
            .setTitle('Time to vote!')
            .setDescription(list.join('\n'));

        const msg = await this.channel.send({
            embeds: [embed],
            components: rows,
        });
        setTimeout(() => {
            msg.edit({ components: [] });
            this.endGame();
        }, 60e3);
    }
    endGame() {
        const lb = this.players.sort((a, b) => {
            return a.points - b.points;
        });
        const winner = lb[0];
        const embed = new EmbedBuilder()
            .setTitle('Winner!')
            .setColor(Color.Cyan).setDescription(stripIndents`
            ${this.channel.guild.members.cache
                .get(winner.id)
                ?.toString()} wins this round with \`${winner.points} points\`.
            
            **Submission:** 
            ${this.formatCard(winner.submission)}
            `);
        delete this.module.games[this.channel.id];
        return this.channel.send({ embeds: [embed] });
    }
    chunk<T>(array: T[], size: number): T[][] {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
    formatCard(str: string) {
        return this.card.replace(/_/g, str);
    }
}
