const ReelService = require("../services/ReelService");
const fileUploadService = require("../util/s3");

module.exports = () => {
  const getUploadUrl = async (req, res, next) => {
    console.log("ReelController => getUploadUrl");
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      req.rCode = 0;
      req.msg = "file_name_and_type_required";
      return next();
    }

    const data = await fileUploadService.getPresignedUploadUrl({
      fileName,
      contentType: fileType,
      folder: "reels",
    });

    req.rData = data;
    req.msg = "success";
    next();
  };

  const publish = async (req, res, next) => {
    console.log("ReelController => publish");
    const { userId, reelId, video_url, thumbnail_url, caption, competitionId, music } =
      req.body;

    const reel = await ReelService().publishReel(reelId, userId, {
      video_url,
      thumbnail_url,
      caption,
      competition: competitionId || null,
      music,
    });

    req.rData = reel;
    req.msg = "reel_published";
    next();
  };

  const saveDraft = async (req, res, next) => {
    console.log("ReelController => saveDraft");
    const { userId, reelId, video_url, thumbnail_url, caption, competitionId, music } =
      req.body;

    let draft;
    if (reelId) {
      draft = await ReelService().updateDraft(reelId, userId, {
        video_url,
        thumbnail_url,
        caption,
        competition: competitionId || null,
        music,
      });
    }

    if (!draft) {
      draft = await ReelService().createDraftReel(userId, {
        video_url,
        thumbnail_url,
        caption,
        competition: competitionId || null,
        music,
      });
    }

    req.rData = draft;
    req.msg = "draft_saved";
    next();
  };

  const getDraft = async (req, res, next) => {
    console.log("ReelController => getDraft");
    const { userId } = req.body;

    const draft = await ReelService().getDraftForUser(userId);

    req.rData = draft || {};
    req.msg = "success";
    next();
  };

  return { getUploadUrl, publish, saveDraft, getDraft };
};
