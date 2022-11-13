import {
    Events,
    Interaction
} from 'discord.js';
import Event from 'struct/Event';
import Kottu from 'struct/Kottu';

export default new Event(Events.InteractionCreate, async (kottu: Kottu, interaction: Interaction): Promise < void > => {
    if (interaction.isChatInputCommand()) {
        console.log('a');
        const command = kottu.commands.get(interaction.commandName);
        console.log(command);
        if (!command) {
            await interaction.reply('This command is unavailable!');
            Promise.resolve();
        }
        command?.execute(interaction);
    }
});