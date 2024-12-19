import formidable from "formidable";
import cloudinary from "@/lib/cloudinaryConfig";
import { NextApiRequest, NextApiResponse } from "next";
import { collections } from "@/lib/firebaseConfig";
import { getCurrentUser } from "@/lib/auth";
import { addDoc } from "firebase/firestore";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  console.log("Received POST request");

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Error parsing form data" });

    if (!files.file || !Array.isArray(files.file) || files.file.length === 0)
      return res.status(400).json({ error: "No file uploaded" });

    const file = files.file[0]; // assuming single file upload

    try {
      const user = getCurrentUser();
      if (!user) return res.status(401).json({ error: "Unauthorized" });

      // Upload file to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(file.filepath);

      // Save image metadata to Firestore
      await addDoc(collections.images, {
        url: uploadResponse.secure_url,
        author: user.uid,
        createdAt: new Date(),
      });

      return res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error: any) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: "Error during upload" });
    }
  });
}
