/* 
  node index.js \
  --username fabricio \
  --room sala01 \
  --hostUri localhost
*/

import Events from 'events';
import CliConfig from './src/cliConfig.js';
import Socket from './src/socket.js';
import TerminalController from './src/terminalController.js';

const [nodePath, filePath, ...commands] = process.argv;

const config = CliConfig.parseArguments(commands);

console.log(config);

const componentEmmiter = new Events();

/* const controller = new TerminalController(); */

const socketClient = new Socket(config);
await socketClient.initialize();

/* await controller.initializeTable(componentEmmiter); */
