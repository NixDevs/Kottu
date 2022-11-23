import { Command, Kottu } from '@struct';
import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import kills from 'assets/kill.json';
export default class Kill extends Command {
    constructor(kottu: Kottu) {
        super(kottu, {
            name: 'kill',
            description: 'brutally assassinate your friends',
            options: [
                {
                    type: 6,
                    name: 'User',
                    description: 'The target',
                    required: true,
                },
            ],
        });
    }
    public execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const { target, member } = this.getMember(interaction);
        if (!target || !member) {
            return interaction.reply('An unexpected error occurred!');
        }
        if (member?.id === target?.id) {
            this.reply(interaction, {
                content: 'Suicide is not an option!',
                ephemeral: true,
            });
            return Promise.resolve();
        }
        const phrase = this.randomElement(kills);
        let str = phrase as string;
        str = str
            .replace(/\$author/g, interaction.member?.toString() ?? '')
            .replace(/\$mention/g, member?.toString() ?? '');
        this.reply(interaction, { content: str });
        return Promise.resolve();
    }
}
