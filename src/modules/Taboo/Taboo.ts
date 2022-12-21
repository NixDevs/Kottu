import { Base, Kottu } from '@struct';
import { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder,
    Guild, 
    TextChannel, 
    User,
} from 'discord.js';
import { ITabooPlayerData, ITabooCard } from 'types';
import { stripIndents } from 'common-tags';
import { ButtonCustomIds } from 'enums';
import TabooModule from '.';
export default class Taboo extends Base {
    public channel: TextChannel;
    public guild: Guild;
    public players: ITabooPlayerData[];
    public index: number;
    public time: NodeJS.Timeout;
    public module: TabooModule;
    public card: ITabooCard;
    constructor(module: TabooModule, kottu: Kottu, channel: TextChannel) {
        super(kottu);
        this.module = module;
        this.channel = channel;
        this.guild = this.channel.guild;
        this.players = [];
        this.index = 0;
        this.card = module.getCard();
    }
    async entryForm() {
/* ------------------------------------------------------------------------------- */
        const embed = new EmbedBuilder()
            .setColor('Purple')
            .setTitle('A game of taboo has started!')
            .setDescription(stripIndents`
        **Welcome to Taboo!**

        Taboo is all about describing words, with a certain twist. To begin, lets click on the button below! You can always 
        leave by clicking again! The game will start in ${Math.round(Date.now() /1000 + 60)}!

        Make sure you
        •   Read the rules by running \`/taboo info\`
        •   Do not try to find exploits
        •   Have fun!
`);
/* ------------------------------------------------------------------------------- */
        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel('ENTER')
            .setCustomId(ButtonCustomIds.TABOO_ENTRY);
        const buttonDisabled = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel('ENTER')
            .setCustomId(ButtonCustomIds.TABOO_ENTRY)
            .setDisabled(true);
        const component = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(button);
        const componentDisabled = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(buttonDisabled);
        const msg = await this.channel.send({ embeds: [embed], components: [component]});
        setTimeout(()=> {
            msg.edit({ components: [componentDisabled] });
        });
    }
    /**
     * 
     * @param id The user's id
     * @returns the index of the user.
     */
    getPlayerIndex(id: string) {
        return this.players.indexOf(this.players.find(player=> player.id === id) as ITabooPlayerData);
    }
    /**
     * 
     * @param id Why do i do this to myself :,(
     * @returns objects. figure it out yourself.
     */
    getPlayer(id: string) {
        return this.players.find(player=> player.id === id) ?? null;
    }
    interactionHandler(user: User) {
        const data = this.players.find(p=>p.id=== user.id);
        if (!data) {
            this.players.push({ id: user.id, points: 0 });
            return this.channel.send({ content: `${user.username} has joined the game!`});           
        }
        else {
            this.players.splice(this.players.indexOf(data), 1);
            return this.channel.send({ content: `${user.username} has left the game!`});           
        }
    }
    processRound() {
        const currentPlayer = this.players[this.index];
        if (!currentPlayer) return;
    }
    endRound() {
        const embed = new EmbedBuilder()
            .setColor('#BDB76B')
            .setTitle('Round ended!')
            .setDescription(stripIndents`
            **Word**: ${this.card.word}
            **Disallowed**: \`${this.card.banned.join('`, `')}\`
            `)
            .setFooter({ text: 'Next round in 10 seconds!'});
        this.channel.send({ embeds: [embed] });
        if (!this.players[this.index+1]) return this;
        this.sleep(10e3);
        this.index +=1;
    }
    sleep(ms: number): Promise<void> {
        return new Promise((resolve) => {
            this.time = setTimeout(() => {
                resolve();
            }, ms);
        });
    }
    endGame() {
        delete this.module.games[this.channel.guild.id];
        clearTimeout(this.time);
        const sorted = this.players.sort((a, b)=> {
            return a.points - b.points;
        });
        return this.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Game Ended!')
                    .setDescription(stripIndents`
                    **Points Table**
                    ${sorted.map(p=>`<@${p.id}> : \`${p.points}\``)}                    
                    `)
            ]
        });
    }
    isValidInput(string: string) {
        string = string.toLowerCase();
        let validation = true;
        this.card.banned.forEach(word=> {
            if (string.includes(word.toLowerCase())) validation = false;
        }); 
        return string.includes(this.card.word.toLowerCase()) ?? validation;
    }

}
