import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const { metadata } = await req.json();

  // Prepare keyvalues from metadata
  const keyvalues = {};
  for (const [key, value] of Object.entries(metadata)) {
    keyvalues[key] = value;
  }

  const body = {
    message: keyvalues,
  };

  const options = {
    metadata: {
      name: metadata.name || "DefaultName",
      keyvalues: keyvalues,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      { body, options },
      {
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    return NextResponse.json({ message: "Failed to upload to Pinata" }, { status: 500 });
  }
}
