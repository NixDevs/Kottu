import Kottu from './src/struct/Kottu';
import dotenv from 'dotenv';
import config from './src/config';
const clientConfig = config.getParsedConfig();
dotenv.config();

const kottu = new Kottu(clientConfig);
kottu.initiate();
