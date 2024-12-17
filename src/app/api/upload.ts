import cloudinary from "@/lib/cloudinaryConfig";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Invalid method!" });

  try {
    const { file } = req.body;

    // Upload file to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: "tj_quotes",
    });

    return res.status(200).json({ url: uploadResponse.secure_url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Error during upload a file." });
  }
}
