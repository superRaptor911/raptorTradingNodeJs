import {Request, Response} from 'express';
import {WazirxTransactionModel} from '../../models/wazirx/WazirxTransactionModel';
import {checkRequired} from '../../Utility';
import {wazirxGetOrderInfo, wazirxCancelOrder} from '../../wazirx/api';
import {addTraqnsactionToQ} from '../../wazirx/transactions';

export interface TransactionRequest {
  username: string;
  transType: string;
  coinId: string;
  coinCount: number;
  price: number;
  isPlaced: boolean;
  res: Response;
}

export async function wazirxPlaceTransaction(req: Request, res: Response) {
  try {
    checkRequired(req.body, [
      'username',
      'transType',
      'coinId',
      'coinCount',
      'price',
    ]);
    let {username, transType, coinId, coinCount, price} = req.body;

    coinCount = parseFloat(coinCount);
    price = parseFloat(price);

    if (coinCount * price < 50) {
      throw 'Please place more than 50';
    }

    addTraqnsactionToQ(username, transType, coinId, coinCount, price, res);

    // res.status(200).json({
    //   status: true,
    //   message: 'Placed order',
    // });
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

export async function wazirxCheckOrderStatus(req: Request, res: Response) {
  try {
    checkRequired(req.body, ['orderId']);
    const {orderId} = req.body;

    const result = await wazirxGetOrderInfo(orderId);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

export async function wazirxStopOrder(req: Request, res: Response) {
  try {
    checkRequired(req.body, ['username', 'orderId', 'coinId']);
    const {username, orderId, coinId} = req.body;

    const order = await WazirxTransactionModel.findOne({
      username: username,
      id: orderId,
    });

    if (!order) {
      throw `Order ${orderId} not found for user ${username}`;
    }

    if (order.status !== 'PENDING') {
      throw `Order ${orderId} was already cancelled`;
    }

    const result = await wazirxCancelOrder(coinId, orderId);
    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

export async function wazirxGetTransactionList(req: Request, res: Response) {
  try {
    checkRequired(req.body, ['username']);
    const {username} = req.body;

    const transactions = await WazirxTransactionModel.find({
      username: username,
    });

    res.status(200).json({
      status: true,
      data: transactions,
    });
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}
