import {
  mainMenu
} from './modules/_mainMenu';

mainMenu.init();

const sockGraph = io.connect('/graph')
