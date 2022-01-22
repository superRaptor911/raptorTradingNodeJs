import mongoose from 'mongoose';

const donModel = new mongoose.Schema({
  username: String,
  amount: Number,
  transId: String,
});

const DonationModel = mongoose.model('Donations', donModel);
export default DonationModel;
// module.exports = DonationModel;
