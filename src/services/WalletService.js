const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const Reel = require("../models/Reel");
const mongoose = require("mongoose");

module.exports = () => {
  const getOrCreateWallet = async (userId) => {
    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      wallet = await Wallet.create({ user: userId, balance: 0 });
    }
    return wallet;
  };

  const credit = async (
    userId,
    amount,
    { type, relatedReel, relatedUser, note },
    session,
  ) => {
    const wallet = await Wallet.findOneAndUpdate(
      { user: userId },
      { $inc: { balance: amount }, $setOnInsert: { user: userId } },
      { new: true, upsert: true, session },
    );

    await Transaction.create(
      [
        {
          user: userId,
          type,
          amount,
          balanceAfter: wallet.balance,
          relatedReel: relatedReel || null,
          relatedUser: relatedUser || null,
          note: note || "",
        },
      ],
      { session },
    );

    return wallet;
  };

  const debit = async (
    userId,
    amount,
    { type, relatedReel, relatedUser, note },
    session,
  ) => {
    const wallet = await Wallet.findOneAndUpdate(
      { user: userId, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { new: true, session },
    );

    if (!wallet) {
      throw new Error("insufficient_balance");
    }

    await Transaction.create(
      [
        {
          user: userId,
          type,
          amount,
          balanceAfter: wallet.balance,
          relatedReel: relatedReel || null,
          relatedUser: relatedUser || null,
          note: note || "",
        },
      ],
      { session },
    );

    return wallet;
  };

  const listTransactions = async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      Transaction.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments({ user: userId }),
    ]);

    return {
      page,
      limit,
      total,
      hasMore: skip + transactions.length < total,
      transactions,
    };
  };

  const tip = async (fromUserId, toUserId, reelId, amount) => {
    if (fromUserId.toString() === toUserId.toString()) {
      throw new Error("cannot_tip_self");
    }

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await debit(
          fromUserId,
          amount,
          { type: "TIP_SENT", relatedReel: reelId, relatedUser: toUserId },
          session,
        );

        await credit(
          toUserId,
          amount,
          { type: "TIP_RECEIVED", relatedReel: reelId, relatedUser: fromUserId },
          session,
        );

        await Reel.updateOne(
          { _id: reelId },
          { $inc: { "stats.tips": 1 } },
          { session },
        );
      });
    } finally {
      await session.endSession();
    }

    return { tipped: amount };
  };

  return { getOrCreateWallet, credit, debit, listTransactions, tip };
};
