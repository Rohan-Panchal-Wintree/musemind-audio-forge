import { decode } from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
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
          console.error("HF api error (raw)", error.response.data, parseErr);
        }
      }

      console.error("HF api error:", error?.response?.data || error.message);
      return res.status(500).json({ message: errorMessage });
    }

    // Save audio as .mp3 file
    const filename = `generated_${uuidv4()}.mp3`;

    // ✅ Ensure the "public/audio" directory exists
    const dir = path.join("public", "audio");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const outputPath = path.join("public", "audio", filename);
    fs.writeFileSync(outputPath, Buffer.from(hfAudio));

    // At this point: Hugging Face response succeeded — deduct 1 credit

    user.credits -= 1;
    await user.save();

    // Respond with URL and credits
    const audioUrl = `${process.env.BASE_URL}/audio/${filename}`;

    // res.set("Content-Type", "audio/mpeg");
    // res.set("Content-Disposition", "attachment; filename=generated.mp3");
    // res.set("X-credits", user.credits.toString());
    console.log("audio generated succesfully", hfAudio);
    console.log("Credits", user.credits);
    return res.status(200).json({
      url: audioUrl,
      credits: user.credits,
      message: "Audio generated succesfully",
    });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
