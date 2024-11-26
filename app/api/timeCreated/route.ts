import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const WARPCAST_API_KEY = process.env.WARPCAST_API_KEY;

export async function GET(req: NextRequest) {
  console.log(`API route called at ${new Date().toISOString()}`);
  console.log(`Full URL: ${req.url}`);

  const fid = req.nextUrl.searchParams.get("fid");
  console.log(`Requested fid: ${fid}`);

  if (!fid) {
    console.log("Error: fid parameter is missing");
    return NextResponse.json(
      { error: "fid parameter is required" },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching data from API for fid: ${fid}`);
    const apiUrl = `https://api.warpcast.com/v2/user?fid=${fid}`;
    const response = await axios.get(apiUrl);

    const followerCount1 = response.data?.result?.user?.followerCount;

    if (followerCount1 === undefined) {
      console.error("followerCount not found in the response");
      return NextResponse.json(
        { error: "followerCount not found for the provided fid" },
        { status: 404 }
      );
    }

    const followerCount = new Intl.NumberFormat('en-US').format(followerCount1);
    console.log(`Fetched followerCount: ${followerCount}`);

    // Get the current date and time in UTC
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0]; // Extract the date part: YYYY-MM-DD
    const currentTime = now.toISOString().split("T")[1].split("Z")[0]; // Extract the time part: HH:MM:SS

    // Construct the message
    const message = `[Automated]
Your current followers count as of 
${currentDate}  ${currentTime} UTC is 
${followerCount}.`;
    const putPayload = {
      recipientFid: parseInt(fid, 10),
      message,
      idempotencyKey: crypto.randomUUID(),
    };

    console.log(`Sending Direct Cast to fid: ${fid} with message: "${message}"`);
    const putResponse = await axios.put(
      "https://api.warpcast.com/v2/ext-send-direct-cast",
      putPayload,
      {
        headers: {
          Authorization: `Bearer ${WARPCAST_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Direct Cast sent successfully:", putResponse.data);

    return NextResponse.json({
      fid,
      followerCount,
      message,
      directCastStatus: "Sent successfully",
      directCastResponse: putResponse.data,
    });
  } catch (error) {
    console.error("Unexpected error:", error);

    let errorMessage = "An unexpected error occurred";
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data || error.message;
      statusCode = error.response?.status || 500;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
