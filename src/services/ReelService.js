const Reel = require("../models/Reel");
const ReelInteraction = require("../models/ReelInteraction");
const Competition = require("../models/Competition");
const Follow = require("../models/Follow");
const mongoose = require("mongoose");

module.exports = () => {
  const formatReel = async (reel, userId) => {
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const [hasVoted, isSaved, hasTipped, isFollowing] = await Promise.all([
      ReelInteraction.exists({
        user: objectUserId,
        reel: reel._id,
        type: "vote",
      }),
      ReelInteraction.exists({
        user: objectUserId,
        reel: reel._id,
        type: "save",
      }),
      ReelInteraction.exists({
        user: objectUserId,
        reel: reel._id,
        type: "tip",
      }),
      Follow.exists({
        follower: objectUserId,
        following: reel.author._id,
      }),
    ]);

    return {
      _id: reel._id,
      video_url: reel.video_url,
      thumbnail_url: reel.thumbnail_url,
      caption: reel.caption,
      createdAt: reel.createdAt,
      author: {
        _id: reel.author._id,
        username: reel.author.username || `@${reel.author.firstName}`,
        profile_picture_url: reel.author.profileImage || "",
        is_followed_by_me: !!isFollowing,
      },
      music: reel.music || { id: "", name: "" },
      stats: {
        votes: reel.stats.votes,
        comments: reel.stats.comments,
        shares: reel.stats.shares,
        saves: reel.stats.saves,
        tips: reel.stats.tips,
      },
      user_interactions: {
        has_voted: !!hasVoted,
        is_saved: !!isSaved,
        has_tipped: !!hasTipped,
      },
    };
  };

  const getMatrix = async (userId, page, limit) => {
    const skip = (page - 1) * limit;

    const competitions = await Competition.find({
      status: { $in: ["LIVE", "live"] },
      isActive: true,
      isDeleted: { $ne: true },
    })
      .sort({ "participants.length": -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalLive = await Competition.countDocuments({
      status: { $in: ["LIVE", "live"] },
      isActive: true,
      isDeleted: { $ne: true },
    });

    const hasMore = skip + limit < totalLive;

    const competitionsWithReels = await Promise.all(
      competitions.map(async (comp) => {
        const reels = await Reel.find({
          competition: comp._id,
          isActive: true,
          isDeleted: { $ne: true },
        })
          .sort({ "stats.votes": -1 })
          .limit(3)
          .populate("author", "_id firstName lastName username profileImage")
          .lean();

        const totalEntries = await Reel.countDocuments({
          competition: comp._id,
          isActive: true,
          isDeleted: { $ne: true },
        });

        const initialReels = await Promise.all(
          reels.map((reel) => formatReel(reel, userId)),
        );

        return {
          _id: comp._id,
          title: comp.title,
          prize: comp.prizePool,
          endDate: comp.endDate,
          totalEntries,
          initialReels,
        };
      }),
    );

    return {
      currentPage: page,
      hasMore,
      competitions: competitionsWithReels,
    };
  };

  const getCompetitionReels = async (competitionId, userId, cursor, limit) => {
    const query = {
      competition: new mongoose.Types.ObjectId(competitionId),
      isActive: true,
      isDeleted: { $ne: true },
    };

    if (cursor) {
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const reels = await Reel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate("author", "_id firstName lastName username profileImage")
      .lean();

    const hasMore = reels.length > limit;
    if (hasMore) reels.pop();

    const formattedReels = await Promise.all(
      reels.map((reel) => formatReel(reel, userId)),
    );

    const nextCursor =
      formattedReels.length > 0
        ? formattedReels[formattedReels.length - 1]._id
        : null;

    return {
      competitionId,
      nextCursor: hasMore ? nextCursor : null,
      hasMore,
      reels: formattedReels,
    };
  };

  const toggleAction = async (reelId, userId, actionType) => {
    const objectUserId = new mongoose.Types.ObjectId(userId);
    const objectReelId = new mongoose.Types.ObjectId(reelId);

    const reel = await Reel.findById(objectReelId);
    if (!reel) return null;

    // If action is "vote", check the reel is part of an active competition
    if (actionType === "vote") {
      if (!reel.competition) {
        throw new Error("Voting is only allowed on competition entries");
      }
      const competition = await Competition.findOne({
        _id: reel.competition,
        status: "LIVE",
      });
      if (!competition) {
        throw new Error(
          "Voting is only allowed on entries in active competitions",
        );
      }
    }

    // Check if interaction exists
    const existing = await ReelInteraction.findOne({
      user: objectUserId,
      reel: objectReelId,
      type: actionType,
    });

    const statsField = getStatsField(actionType);

    if (existing) {
      // Remove interaction
      await ReelInteraction.deleteOne({ _id: existing._id });
      if (statsField) {
        await Reel.updateOne(
          { _id: objectReelId },
          { $inc: { [`stats.${statsField}`]: -1 } },
        );
      }
    } else {
      // Add interaction
      await ReelInteraction.create({
        user: objectUserId,
        reel: objectReelId,
        type: actionType,
      });
      if (statsField) {
        await Reel.updateOne(
          { _id: objectReelId },
          { $inc: { [`stats.${statsField}`]: 1 } },
        );
      }
    }

    // Fetch updated reel
    const updatedReel = await Reel.findById(objectReelId).lean();

    const [hasVoted, isLiked, isSaved] = await Promise.all([
      ReelInteraction.exists({
        user: objectUserId,
        reel: objectReelId,
        type: "vote",
      }),
      ReelInteraction.exists({
        user: objectUserId,
        reel: objectReelId,
        type: "like",
      }),
      ReelInteraction.exists({
        user: objectUserId,
        reel: objectReelId,
        type: "save",
      }),
    ]);

    return {
      reelId,
      action_type: actionType,
      updated_stats: {
        votes: updatedReel.stats.votes,
        likes: updatedReel.stats.likes,
        saves: updatedReel.stats.saves,
      },
      user_interactions: {
        has_voted: !!hasVoted,
        is_liked: !!isLiked,
        is_saved: !!isSaved,
      },
    };
  };

  const getStatsField = (actionType) => {
    const map = {
      vote: "votes",
      like: "likes",
      save: "saves",
      tip: "tips",
    };
    return map[actionType] || null;
  };

  const listReels = async (userId, cursor, limit) => {
    const query = {
      isActive: true,
      isDeleted: { $ne: true },
    };

    if (cursor) {
      try {
        query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
      } catch (e) {
        // ignore invalid cursor — start from newest
      }
    }

    const reels = await Reel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate("author", "_id firstName lastName username profileImage")
      .lean();

    const hasMore = reels.length > limit;
    if (hasMore) reels.pop();

    const formatted = await Promise.all(
      reels.map((r) => formatReel(r, userId)),
    );

    const nextCursor =
      hasMore && formatted.length > 0
        ? formatted[formatted.length - 1]._id
        : null;

    return {
      nextCursor,
      hasMore,
      reels: formatted,
    };
  };

  return {
    getMatrix,
    getCompetitionReels,
    toggleAction,
    listReels,
  };
};
