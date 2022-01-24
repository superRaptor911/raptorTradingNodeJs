import {Request, Response} from 'express';
import {StopLossModel} from '../../models/bots/StopLossModel';
import {checkRequired} from '../../Utility';

export async function stopLossListRules(req: Request, res: Response) {
  try {
    checkRequired(req.body, ['username']);

    const {username} = req.body;
    const rules = await StopLossModel.find({username: username});

    res.status(200).json({
      status: true,
      message: 'GG',
      data: rules,
    });
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

export async function stopLossAddRule(req: Request, res: Response) {
  try {
    checkRequired(req.body, [
      'username',
      'isEnabled',
      'coinId',
      'transType',
      'condition',
      'price',
      'count',
    ]);

    const {username, isEnabled, coinId, transType, condition, price, count} =
      req.body;

    const mdl = new StopLossModel();
    mdl.username = username;
    mdl.isEnabled = isEnabled;
    mdl.coinId = coinId;
    mdl.transType = transType;
    mdl.condition = condition;
    mdl.price = price;
    mdl.count = count;
    mdl.placeTime = new Date();
    await mdl.save();

    res.status(200).json({
      status: true,
      message: 'GG',
    });
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

export async function stopLossEditRule(req: Request, res: Response) {
  try {
    checkRequired(req.body, [
      'id',
      'username',
      'isEnabled',
      'coinId',
      'transType',
      'condition',
      'price',
      'count',
    ]);

    const {
      id,
      username,
      isEnabled,
      coinId,
      transType,
      condition,
      price,
      count,
    } = req.body;

    const mdl = await StopLossModel.findOne({_id: id});
    if (mdl) {
      mdl.username = username;
      mdl.isEnabled = isEnabled;
      mdl.coinId = coinId;
      mdl.transType = transType;
      mdl.condition = condition;
      mdl.price = price;
      mdl.count = count;
      await mdl.save();

      res.status(200).json({
        status: true,
        message: 'GG',
      });
    } else {
      throw 'Model not found';
    }
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

export async function stopLossDeleteRule(req: Request, res: Response) {
  try {
    checkRequired(req.body, ['id']);
    const {id} = req.body;
    await StopLossModel.deleteOne({_id: id});

    res.status(200).json({
      status: true,
      message: 'GG',
    });
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}
