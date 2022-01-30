/* eslint-disable no-throw-literal */
import {Request, Response} from 'express';
import {WazirxTransactionModel} from '../../models/wazirx/WazirxTransactionModel';
import {checkRequired} from '../../Utility';
import {wazirxGetOrderInfo, wazirxCancelOrder} from '../../wazirx/api';
import {
  wazirxPlaceSellOrder,
  wazirxPlaceBuyOrder,
} from '../../wazirx/transactions';

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

    let orderId = '0';
    if (transType === 'SELL') {
      orderId = await wazirxPlaceSellOrder(username, coinId, coinCount, price);
    } else {
      orderId = await wazirxPlaceBuyOrder(username, coinId, coinCount, price);
    }
    res.status(200).json({
      status: true,
      orderId: orderId,
      message: 'Successfully Placed order ' + orderId,
    });
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
