import {Router} from 'express';
import {
  stopLossAddRule,
  stopLossEditRule,
  stopLossListRules,
  stopLossDeleteRule,
} from '../controller/wazirx/StopLossBot';
import {
  wazirxPlaceTransaction,
  wazirxStopOrder,
  wazirxCheckOrderStatus,
  wazirxGetTransactionList,
} from '../controller/wazirx/WazirxTransaction';

const WazirxRouter = Router();

WazirxRouter.post('/add', wazirxPlaceTransaction);
WazirxRouter.post('/cancel', wazirxStopOrder);
WazirxRouter.post('/status', wazirxCheckOrderStatus);
WazirxRouter.post('/list', wazirxGetTransactionList);
WazirxRouter.post('/stoplossbotaddrule', stopLossAddRule);
WazirxRouter.post('/stoplossboteditrule', stopLossEditRule);
WazirxRouter.post('/stoplossbotlistrules', stopLossListRules);
WazirxRouter.post('/stoplossbotdeleterule', stopLossDeleteRule);

export default WazirxRouter;
