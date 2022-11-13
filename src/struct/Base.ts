import KottuClient from 'struct/Kottu';
import {
    ChatInputCommandInteraction,
    Client, InteractionReplyOptions, InteractionResponse
} from 'discord.js';
import { PrismaClient } from '@prisma/client';
import logger from '../transports/winston';
import { Logger } from 'winston';
type Kottu = KottuClient;
export default class Base {
    public kottu: Kottu;
    public client: Client;
    public logger: Logger;
    public prisma: PrismaClient;
    constructor(kottu: Kottu) {
        this.kottu = kottu;
        this.client = kottu.client; 
        this.logger = logger;

    }
    public toCodeBlock(str: string, lang:string): string {
        return `\`\`\`${lang||''}\n${str}\`\`\``;
    }
    public reply(interaction: ChatInputCommandInteraction, data: InteractionReplyOptions): Promise<InteractionResponse> {
        return interaction.reply(data);
    }
    public randomInteger(min: number, max: number): number {
        return Math.round(Math.random()*max) + min;
    }
    public randomElement(arr: unknown[]):unknown {
        return arr[Math.round(Math.random()*arr.length)];
    }
    public findAndSplice(arr: unknown[], element: unknown) {
        const index = arr.indexOf(element);
        if (index < 0) return;
        else arr.splice(index, 1);
    }
    public async getGuildById(id: string) {
        return await this.prisma.guild.findUnique({
            where: {
                id: id
            }
        });
    }
    public async getUserById(id: string) {
        return await this.prisma.guild.findUnique({
            where: {
                id: id
            }
        });
    }


}
