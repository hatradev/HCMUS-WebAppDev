const Acc = require("../models/account.model");
const Hist = require("../models/history.model");
// const bcrypt = require('bcrypt');

class balanceControllers {
  // [GET] /
  getBalanceP = async (req, res, next) => {
    try {
      let {startDate, endDate} = req.query;
      const acc = await Acc.findOne({ buyid: "65a5892a37d587e75cddc382" });
      let hist;
      if (startDate && endDate){   
        startDate = new Date(startDate);
        endDate = new Date(endDate);  
        hist = await Hist.find({ idaccount: acc._id, date: { $gte: startDate, $lte: endDate } }).sort({date: -1});
      }
      else{
        hist = await Hist.find({ idaccount: acc._id }).sort({date: -1});
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
}

module.exports = new balanceControllers();
