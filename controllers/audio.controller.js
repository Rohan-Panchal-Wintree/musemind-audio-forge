import { decode } from "jsonwebtoken";
import User from "../models/user.model.js";
import axios from "axios";

export const generateAudio = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user || user.credits <= 0) {
      return res.status(403).json({ message: "Insufficient credits" });
    }

    const { prompt, duration } = req.body;

    if (!prompt || !duration) {
      return res
        .status(400)
        .json({ message: "Prompt and duration are required" });
    }

    let hfAudio;

    try {
      console.log("prompt sent to HF", prompt, duration);
      const hfResponse = await axios.post(
        "https://shubham7890-musicgen-duplicate-r.hf.space/generate/",
        { prompt: prompt, duration: Number(duration) },
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      hfAudio = hfResponse.data;
    } catch (error) {
      let errorMessage = "Failed to generate audio";

      if (error?.response?.data) {
        try {
          const decoded = JSON.parse(
            Buffer.from(error.response.data).toString("utf-8")
          );
          console.error("HF api error (decoded)", decoded);
          if (decoded.detail) errorMessage = decoded.detail;
        } catch (parseErr) {
          console.error("HF api error (raw)", error.response.data);
        }
      }

      console.error("HF api error:", error?.response?.data || error.message);
      return res.status(500).json({ message: "Failed to generate audio" });
    }

    // At this point: Hugging Face response succeeded — deduct 1 credit

    user.credits -= 1;
    await user.save();

    res.set("Content-Type", "audio/mpeg");
    res.set("Content-Disposition", "attachment; filename=generated.mp3");
    console.log("audio generated succesfully", hfAudio);
    console.log("Credits", user.credits);
    return res.status(200).send(hfAudio);
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
