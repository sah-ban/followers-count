import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

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
    const followerCount =new Intl.NumberFormat('en-US').format(followerCount1);
    console.log(`Fetched followerCount: ${followerCount}`);

    return NextResponse.json({
      fid,
      followerCount,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
