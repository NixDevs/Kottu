import KottuClient from 'struct/Kottu';
import {
    ChatInputCommandInteraction,
    Client, InteractionReplyOptions, InteractionResponse
} from 'discord.js';
import { PrismaClient } from '@prisma/client';
import logger from '../transports/winston';
import { Logger } from 'winston';
type Kottu = KottuClient;
/**
 * The base client for all classes
 */
export default class Base {
    /**
     * The main client
     */
    public kottu: Kottu;
    /**
     * The websocket client
     */
    public client: Client;
    /**
     * the winston chad logger
     */
    public logger: Logger;
    /**
     * Prisma is a cool database
     */
    public prisma: PrismaClient;
    constructor(kottu: Kottu) {
        this.kottu = kottu;
        this.client = kottu.client; 
        this.logger = logger;

    }
    /**
     * Converts string to a colored code block
     */
    public toCodeBlock(str: string, lang:string): string {
        return `\`\`\`${lang||''}\n${str}\`\`\``;
    }
    /**
     * Centralized reply function
     */
    public reply(interaction: ChatInputCommandInteraction, data: InteractionReplyOptions): Promise<InteractionResponse> {
        return interaction.reply(data);
    }
    /** 
     * Returns a random integer between `min` and `max` values
     */
    public randomInteger(min: number, max: number): number {
        return Math.round(Math.random()*max) + min;
    }
    /**
     * Returns a random element from array
     */
    public randomElement(arr: unknown[]): unknown {
        return arr[Math.round(Math.random()*arr.length)];
    }
    /**
     * Splice and Dice your array. Removes a given element
     */
    public findAndSplice(arr: unknown[], element: unknown) {
        const index = arr.indexOf(element);
        if (index < 0) return;
        else arr.splice(index, 1);
    }
    /**
     * Fetches a guild by Id. Returns a promise
     */

    public async getGuildById(id: string) {
        return await this.prisma.guild.findUnique({
            where: {
                id: id
            }
        });
    }
    /**
     * Fetches a user by id. Returns a promise.
     */
    public async getUserById(id: string) {
        return await this.prisma.guild.findUnique({
            where: {
                id: id
            }
        });
    }


}
