import { Kottu, Module } from '@struct';
import { Collection } from 'discord.js';
import * as modules from 'modules';
export default class ModuleCollection extends Collection<string, Module> {
    public kottu: Kottu;
    constructor(kottu: Kottu) {
        super();
        this.kottu = kottu;
    }
    loadModules() {
        const values = Object.values(modules);
        if (!values.length) return;
        values.forEach((module) => {
            this.kottu.logger.info(`[Module] Loaded ${module}`);
        });
    }
}
