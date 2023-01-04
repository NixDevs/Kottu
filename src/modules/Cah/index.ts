import { Kottu, Module } from '@struct';
import CAH from './CAH';
export default class CardsAgainstHumanityModule extends Module {
    public module: string;
    public friendlyName: string;
    public games: Record<string, CAH>;
    constructor(kottu: Kottu) {
        super(kottu);
        this.module = 'cardsagainsthumanity';
        this.friendlyName = 'Cards Against Humanity';
        this.games = {};
    }
}
