import { Kottu, Module } from '@struct';
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
}
