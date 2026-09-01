import dotenv from "dotenv"
dotenv.config()
import axios from "axios"

const BASE_URL = "https://www.googleapis.com/youtube/v3/search"

const searchVideo = async (topic) => {
  try {
    const query = `${topic} full tutorial`
    const { data } = await axios.get(BASE_URL, {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        part: "snippet",
        q: query,
        maxResults: 1,
        type: "video",
        relevanceLanguage: "en",
      },
    })

    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      return {
        title: video.snippet.title,
        channel: video.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      };
    }

    return null;
  } catch (error) {
    console.log("YouTube Search Error:", error.message)
    return null;
  }
}

export default searchVideo