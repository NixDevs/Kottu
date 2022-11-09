import Kottu from './src/struct/Kottu';
import dotenv from 'dotenv';
import config from './config.json';
dotenv.config();

const kottu = new Kottu(config);
kottu.initiate();