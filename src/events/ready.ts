import { Events } from 'discord.js';
import Event from 'struct/Event';
import Kottu from 'struct/Kottu';
export default new Event(Events.ClientReady, (kottu:Kottu, client)=> {
    kottu.logger.info(`Successfully logged in as ${client.user.tag}`);    
});
