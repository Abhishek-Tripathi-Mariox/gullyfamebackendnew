const WalletService = require("../services/WalletService");
const Reel = require("../models/Reel");

module.exports = () => {
  const getWallet = async (req, res, next) => {
    console.log("WalletController => getWallet");
    const { userId } = req.body;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;

    const [wallet, transactions] = await Promise.all([
      WalletService().getOrCreateWallet(userId),
      WalletService().listTransactions(userId, page, limit),
    ]);

    req.rData = {
      balance: wallet.balance,
      ...transactions,
    };
    req.msg = "success";
    next();
  };

  const recharge = async (req, res, next) => {
    console.log("WalletController => recharge");
    const { userId, amount } = req.body;

    if (!amount || amount <= 0) {
      req.rCode = 0;
      req.msg = "invalid_amount";
      return next();
    }

    // Placeholder for where a real payment gateway's success webhook will
    // eventually call this same credit path once one is integrated.
    const wallet = await WalletService().credit(userId, amount, {
      type: "RECHARGE",
      note: "Wallet recharge",
    });

    req.rData = { balance: wallet.balance };
    req.msg = "wallet_recharged";
    next();
  };

  const tipCreator = async (req, res, next) => {
    console.log("WalletController => tipCreator");
    const { userId, amount } = req.body;
    const { reelId } = req.params;

    if (!amount || amount <= 0) {
      req.rCode = 0;
      req.msg = "invalid_amount";
      return next();
    }

    const reel = await Reel.findOne({ _id: reelId, isDeleted: { $ne: true } });
    if (!reel) {
      req.rCode = 5;
      req.msg = "reel_not_found";
      return next();
    }

    const data = await WalletService().tip(
      userId,
      reel.author,
      reelId,
      amount,
    );

    req.rData = data;
    req.msg = "tip_sent";
    next();
  };

  return { getWallet, recharge, tipCreator };
};
