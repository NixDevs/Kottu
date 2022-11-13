import Base from './Base';
import Kottu from './Kottu';

export default class Module extends Base {
    public name: string;
    public events: string[];

    constructor(kottu: Kottu) {
        super(kottu);
        
        this.name = this.constructor.name;

        this.events = ['messageCreate', 'interactionCreate'];

    }
}