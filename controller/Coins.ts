import express from 'express';
import {CoinModel} from '../models/CoinModel';
import {checkRequired} from '../Utility';
import {coinData2coinPriceList} from './coins/utility';

export async function coinRoot(_req: express.Request, res: express.Response) {
  try {
    const result = await CoinModel.find({});
    res.status(200).json({status: true, data: result});
  } catch (e) {
    console.error('Coins::coinRoot ', e);
    res.status(500).json({status: false, message: e});
  }
}

export async function addCoin(req: express.Request, res: express.Response) {
  try {
    checkRequired(req.body, ['name', 'id', 'avatar']);
    const {name, id, avatar} = req.body;

    const doc = new CoinModel();
    doc.name = name;
    doc.avatar = avatar;
    doc.id = id;
    await doc.save();

    res.status(200).json({status: true, message: 'GG'});
  } catch (e) {
    console.error('Coins::addCoin ', e);
    res.status(500).json({status: false, message: 'Error'});
  }
}

export async function deleteCoin(req: express.Request, res: express.Response) {
  try {
    const coin = req.params.id;
    await CoinModel.deleteOne({name: coin});
    res.status(200).json({status: true});
  } catch (e) {
    res.status(500).json({status: false, message: e});
  }
}

export async function coinPrice(_req: express.Request, res: express.Response) {
  try {
    const apiPath = 'https://api.wazirx.com/api/v2/tickers';
    const response = await fetch(apiPath, {
      method: 'GET',
    });
    const coins = await CoinModel.find({});
    const coinData = await response.json();
    const coinPriceList = coinData2coinPriceList(coinData, coins);
    res.status(200).json({status: true, data: coinPriceList});
  } catch (e) {
    res.status(500).json({status: false, message: e});
  }
}