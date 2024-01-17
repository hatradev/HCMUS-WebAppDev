const Acc = require("../models/account.model");
const Hist = require("../models/history.model");
// const bcrypt = require('bcrypt');

class balanceControllers {
  // [GET] /
  getBalanceP = async (req, res, next) => {
    console.log("BALANCE: ", req.cookies.user._id);
    try {
      let { startDate, endDate } = req.query;

      const acc = await Acc.findOne({ buyid: req.cookies.user._id });
      console.log(acc);
      let hist;
      if (startDate && endDate) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        endDate.setHours(23, 59, 59, 999);
        hist = await Hist.find({
          idaccount: acc._id,
          date: { $gte: startDate, $lte: endDate },
        }).sort({ date: -1 });
      } else {
        hist = await Hist.find({ idaccount: acc._id }).sort({ date: -1 });
      }
      // console.log('acc', acc, 'hist', hist)
      let arr = hist.map((item) => ({
        id: item._id,
        isIn: item.isIn,
        money: item.money,
        balance: item.balance,
        description: item.description,
        date: item.date,
      }));

      res.render("balance", {
        balance: acc.balance,
        history: arr,
        startDate,
        endDate,
      });
    } catch (err) {
      next(err);
    }
  };
  recharge = async (req, res, next) => {
    const { amount } = req.query;
    const acc = await Acc.findOne({ buyid: req.cookies.user._id });
    const newBalance = acc.balance + parseInt(amount);

    //update balance
    await Acc.updateOne(
      { _id: acc._id },
      {
        $set: { balance: newBalance },
      }
    );
    //insert history
    const newHist = {
      idaccount: acc._id,
      isIn: true,
      money: parseInt(amount),
      balance: newBalance,
      description: "recharge",
    };
    await Hist.create(newHist);
    res.redirect("/balance");
  };
}

module.exports = new balanceControllers();
