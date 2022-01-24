import {sleep} from '../Utility';
import {execStopLoss} from './stopLoss/stopLossBot';

export async function execBots() {
  while (true) {
    await execStopLoss();
    await sleep(120000);
  }
}
