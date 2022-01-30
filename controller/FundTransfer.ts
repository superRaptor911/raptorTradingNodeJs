import {Request, Response} from 'express';
import {FundTransferModel} from '../models/FundTransferModel';
import {checkRequired} from '../Utility';
import {depositFund, withdrawFund, addDonation} from './fund/fund';

// Transfer fund to account
export async function transferFund(req: Request, res: Response) {
  try {
    checkRequired(req.body, [
      'username',
      'transType',
      'amount',
      'fee',
      'donation',
    ]);

    let {username, transType, amount, fee, donation, time, force} = req.body;

    amount = parseFloat(amount);
    fee = parseFloat(fee);
    donation = parseFloat(donation);

    if (transType === 'DEPOSIT') {
      await depositFund(username, amount, fee, donation);
    } else {
      await withdrawFund(username, amount, fee, donation, force);
    }

    // Save receipt
    const doc = new FundTransferModel();
    doc.username = username;
    doc.transType = transType;
    doc.amount = amount;
    doc.fee = fee;
    doc.donation = donation;
    doc.time = time;
    await doc.save();

    await addDonation(username, donation, doc._id);
    res.status(200).json({status: true, message: 'Success'});
  } catch (e) {
    console.error('FundTransfer::transferFund', e);
    res.status(500).json({status: false, message: e});
  }
}

export async function deleteFundTransfer(req: Request, res: Response) {
  try {
    const id = req.params.id;
    await FundTransferModel.deleteOne({_id: id});
    res.status(200).json({status: true});
  } catch (e) {
    res.status(500).json({status: false, message: e});
  }
}

export async function listAll(_req: Request, res: Response) {
  try {
    const transfers = await FundTransferModel.find({});
    res.status(200).json({status: true, data: transfers});
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}

export async function listUserTransfer(req: Request, res: Response) {
  try {
    const username = req.params.id;
    const transfers = await FundTransferModel.findOne({username: username});
    res.status(200).json({status: true, data: transfers});
  } catch (e) {
    /* handle error */
    res.status(500).json({status: false, message: e});
  }
}
