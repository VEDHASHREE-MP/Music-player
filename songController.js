import axios from "axios";

const JAMENDO_URL = "https://api.jamendo.com/v3.0/tracks/";
const CLIENT_ID = "ff63761a";

 
const getSongs = async (req, res) => {
  try {
    

    const response = await axios.get("https://api.jamendo.com/v3.0/tracks/?client_id=ff63761a&format=jsonpretty&limit=15");
    const data = response.data;
    // ✅ Always return results array
    res.status(200).json(data);
  } catch (error) {
    console.error("getSongs error:", error.message);
    res.status(500).json({ message: "Failed to fetch songs" });
  }
};

/**
 * GET /api/songs/playlist/tag/:tag
 */
const getPlaylistByTag = async (req, res) => {
  try {
    const tag = (req.params.tag || req.query.tag ||  "").toString().trim();
    if (!tag) {
      return res.status(400).json({ message: "Tag is required" });
    }
    const limit= parseInt(req.query.limit ?? "10",10) || 10;
    const clientId= "ff63761a";
    const params= {
        client_id: clientId,
        format: "jsonpretty",
        tags: tag,
        limit,
    }
    const response = await axios.get("https://api.jamendo.com/v3.0/tracks/", {
      params,
      },
    );

    res.status(200).json({
      results: response.data.results || [],
    });
  } catch (error) {
    console.error("getPlaylistByTag error:", error.message);
    res.status(500).json({ message: "Failed to fetch playlist" });
  }
};

/**
 * POST /api/songs/favourite
 */
const toggleFavourite = async (req, res) => {
  try {
    const user = req.user;
    const song = req.body.song;

    if (!song || !song.id) {
      return res.status(400).json({ message: "Invalid song data" });
    }

    const exists = user.favourites.some((fav) => fav.id === song.id);

    if (exists) {
      user.favourites = user.favourites.filter((fav) => fav.id !== song.id);
    } else {
      user.favourites.push(song);
    }

    await user.save();
    res.status(200).json({ favourites: user.favourites });
  } catch (error) {
    console.error("toggleFavourite error:", error.message);
    res.status(500).json({ message: "Failed to update favourites" });
  }
};

export { getSongs, getPlaylistByTag, toggleFavourite };
