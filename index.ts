import Kottu from './src/struct/Kottu';
import config from './src/config';
const clientConfig = config.getParsedConfig();
console.log(clientConfig);
const kottu = new Kottu(clientConfig);
kottu.initiate();
