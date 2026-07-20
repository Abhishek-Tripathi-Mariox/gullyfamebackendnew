const Competition = require("../models/Competition");

module.exports = () => {
  const homeScreen = async (req, res, next) => {
    console.log("HomeScreenController => homeScreen");

    const liveComps = await Competition.find({
      status: { $in: ["LIVE", "live"] },
      isActive: true,
      isDeleted: { $ne: true },
    })
      .select("_id title startDate endDate image prizePool participants")
      .lean();

    const liveCompetitions = liveComps.map((comp) => ({
      id: comp._id,
      title: comp.title,
      startDate: comp.startDate,
      endDate: comp.endDate,
      participants: comp.participants ? comp.participants.length : 0,
      prize: comp.prizePool,
      image: comp.image,
    }));

    req.rData = {
      banners: [
        {
          id: 1,
          title: "Festive Fashion Specials",
          subtitle: "Big Styles, Big Savings!",
          image: "/images/banners/festive1.png",
        },
        {
          id: 2,
          title: "Mega Sale",
          subtitle: "50% OFF on All Brands",
          image: "/images/banners/festive2.png",
        },
      ],

      categories: [
        {
          id: 1,
          name: "Music",
          icon: "/images/categories/music.png",
        },
        {
          id: 2,
          name: "Dance",
          icon: "/images/categories/dance.png",
        },
        {
          id: 3,
          name: "Cooking",
          icon: "/images/categories/cooking.png",
        },
        {
          id: 4,
          name: "Comedy",
          icon: "/images/categories/comedy.png",
        },
      ],

      trending: [
        {
          id: 101,
          title: "Dance-Off Delhi",
          category: "Dance",
          views: 214000,
          image: "/images/trending/dance-off.png",
          likes: 136,
        },
        {
          id: 102,
          title: "Gully Chef Wars",
          category: "Cooking",
          views: 98000,
          image: "/images/trending/chef-wars.png",
          likes: 82,
        },
        {
          id: 103,
          title: "Mic-Drop Battle",
          category: "Music",
          views: 143000,
          image: "/images/trending/mic-drop.png",
          likes: 117,
        },
      ],

      upcomingCompetitions: [
        {
          id: 201,
          title: "Hip-Hop Championship 2025",
          prize: 5000,
          image: "/images/upcoming/hiphop.png",
          endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          participants: 500,
        },
        {
          id: 202,
          title: "Cooking Wars",
          prize: 5000,
          image: "/images/upcoming/cooking.png",
          endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          participants: 500,
        },
        {
          id: 203,
          title: "Sangeet Ka Mahasangram",
          prize: 3000,
          image: "/images/upcoming/sangeet.png",
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          participants: 500,
        },
      ],

      pastCompetitions: [
        {
          id: 301,
          title: "Hip-Hop Championship 2024",
          views: 89000,
          image: "/images/past/hiphop-past.png",
          winner: "test",
        },
        {
          id: 302,
          title: "Cooking Wars Finale",
          views: 55000,
          image: "/images/past/cooking-past.png",
          winner: "test",
        },
        {
          id: 303,
          title: "Sangeet Final Round",
          views: 74000,
          image: "/images/past/sangeet-past.png",
          winner: "test",
        },
      ],

      topCompetitors: [
        {
          rank: 1,
          name: "Bryan Wolf",
          points: 453,
          image: "/images/competitors/bryan.png",
        },
        {
          rank: 2,
          name: "Meghan Joseph",
          points: 409,
          image: "/images/competitors/meghan.png",
        },
        {
          rank: 3,
          name: "Alex Turner",
          points: 376,
          image: "/images/competitors/alex.png",
        },
      ],

      liveCompetitions,
    };

    req.msg = "success";
    next();
  };

  const getAdminDashboard = async (req, res, next) => {
    console.log("HomeScreenController => homeScreen");

    req.rData = {
      banners: [
        {
          id: 1,
          title: "Festive Fashion Specials",
          subtitle: "Big Styles, Big Savings!",
          image: "/images/banners/festive1.png",
        },
        {
          id: 2,
          title: "Mega Sale",
          subtitle: "50% OFF on All Brands",
          image: "/images/banners/festive2.png",
        },
      ],

      categories: [
        {
          id: 1,
          name: "Music",
          icon: "/images/categories/music.png",
        },
        {
          id: 2,
          name: "Dance",
          icon: "/images/categories/dance.png",
        },
        {
          id: 3,
          name: "Cooking",
          icon: "/images/categories/cooking.png",
        },
        {
          id: 4,
          name: "Comedy",
          icon: "/images/categories/comedy.png",
        },
      ],

      trending: [
        {
          id: 101,
          title: "Dance-Off Delhi",
          category: "Dance",
          views: 214000,
          image: "/images/trending/dance-off.png",
          likes: 136,
        },
        {
          id: 102,
          title: "Gully Chef Wars",
          category: "Cooking",
          views: 98000,
          image: "/images/trending/chef-wars.png",
          likes: 82,
        },
        {
          id: 103,
          title: "Mic-Drop Battle",
          category: "Music",
          views: 143000,
          image: "/images/trending/mic-drop.png",
          likes: 117,
        },
      ],

      upcomingCompetitions: [
        {
          id: 201,
          title: "Hip-Hop Championship 2025",
          prize: 5000,
          image: "/images/upcoming/hiphop.png",
          endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          participants: 500,
        },
        {
          id: 202,
          title: "Cooking Wars",
          prize: 5000,
          image: "/images/upcoming/cooking.png",
          endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          participants: 500,
        },
        {
          id: 203,
          title: "Sangeet Ka Mahasangram",
          prize: 3000,
          image: "/images/upcoming/sangeet.png",
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          participants: 500,
        },
      ],

      pastCompetitions: [
        {
          id: 301,
          title: "Hip-Hop Championship 2024",
          views: 89000,
          image: "/images/past/hiphop-past.png",
          winner: "test",
        },
        {
          id: 302,
          title: "Cooking Wars Finale",
          views: 55000,
          image: "/images/past/cooking-past.png",
          winner: "test",
        },
        {
          id: 303,
          title: "Sangeet Final Round",
          views: 74000,
          image: "/images/past/sangeet-past.png",
          winner: "test",
        },
      ],

      topCompetitors: [
        {
          rank: 1,
          name: "Bryan Wolf",
          points: 453,
          image: "/images/competitors/bryan.png",
        },
        {
          rank: 2,
          name: "Meghan Joseph",
          points: 409,
          image: "/images/competitors/meghan.png",
        },
        {
          rank: 3,
          name: "Alex Turner",
          points: 376,
          image: "/images/competitors/alex.png",
        },
      ],
    };

    req.msg = "success";
    next();
  };

  return {
    homeScreen,
    getAdminDashboard,
  };
};
