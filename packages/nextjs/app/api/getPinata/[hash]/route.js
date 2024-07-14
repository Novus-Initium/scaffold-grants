// /app/api/ipfs/[hash]/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req, { params }) {
  const { hash } = params;

  if (!hash || typeof hash !== "string") {
    return NextResponse.json({ error: "Invalid IPFS hash" }, { status: 400 });
  }

  const url = `https://${process.env.PINATA_GATEWAY}/ipfs/${hash}`;

  try {
    const response = await axios.get(url);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error retrieving JSON from IPFS: ${error.message}`);
    return NextResponse.json({ error: "Failed to retrieve JSON from IPFS" }, { status: 500 });
  }
}
