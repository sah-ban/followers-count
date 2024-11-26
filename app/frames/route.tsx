
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { appURL, formatNumber } from "../utils";

interface State {
  lastFid?: string;
}

const frameHandler = frames(async (ctx) => {
  interface UserData {
    name: string;
    username: string;
    fid: string;
    userCreatedAt:string;
    profileDisplayName: string;
    profileImageUrl: string;
  }
  interface LiveFollowerResponse {
    count: string;
  
  }

  let userData: UserData | undefined;
  let followerCount: LiveFollowerResponse | undefined;


  let error: string | null = null;
  let isLoading = false;

  const fetchUserData = async (fid: string) => {
    isLoading = true;
    try {
      const airstackUrl = `${appURL()}/api/profile?userId=${encodeURIComponent(
        fid
      )}`;
      const airstackResponse = await fetch(airstackUrl);
      if (!airstackResponse.ok) {
        throw new Error(
          `Airstack HTTP error! status: ${airstackResponse.status}`
        );
      }
      const airstackData = await airstackResponse.json();
      if (
        airstackData.userData.Socials.Social &&
        airstackData.userData.Socials.Social.length > 0
      ) {
        const social = airstackData.userData.Socials.Social[0];
        userData = {
          name: social.profileDisplayName || social.profileName || "Unknown",
          username: social.profileName || "unknown",
          fid: social.userId || "N/A",
          userCreatedAt:social.userCreatedAtBlockTimestamp || "N/A",
          profileDisplayName: social.profileDisplayName || "N/A",
          profileImageUrl:
            social.profileImageContentValue?.image?.extraSmall ||
            social.profileImage ||
            "",
        };
      } else {
        throw new Error("No user data found");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      error = (err as Error).message;
    } finally {
      isLoading = false;
    }
  };

  const timeCreatedAt = async (fid: string) => {
    try {
      const fcUrl = `${appURL()}/api/timeCreated?fid=${encodeURIComponent(fid)}`;
      const fidResponse = await fetch(fcUrl);
      if (!fidResponse.ok) {
        throw new Error(`Fid HTTP error! Status: ${fidResponse.status}`);
      }
      const data = await fidResponse.json();
        if (data.fid && data.followerCount) {
        // Extract username and timestamp information
        followerCount = {
          count: data.followerCount,
        };
      } else {
        throw new Error("Invalid response structure or missing data");
      }
    } catch (err) {
      console.error("Error fetching Time Created:", err);
      error = (err as Error).message;
    }
  };
  
  const extractFid = (url: string): string | null => {
    try {
      const parsedUrl = new URL(url);
      let fid = parsedUrl.searchParams.get("userfid");

      console.log("Extracted FID from URL:", fid);
      return fid;
    } catch (e) {
      console.error("Error parsing URL:", e);
      return null;
    }
  };

  let fid: string | null = null;

  if (ctx.message?.requesterFid) {
    fid = ctx.message.requesterFid.toString();
    console.log("Using requester FID:", fid);
  } else if (ctx.url) {
    fid = extractFid(ctx.url.toString());
    console.log("Extracted FID from URL:", fid);
  } else {
    console.log("No ctx.url available");
  }

  if (!fid && (ctx.state as State)?.lastFid) {
    fid = (ctx.state as State).lastFid ?? null;
    console.log("Using FID from state:", fid);
  }

  console.log("Final FID used:", fid);

  const shouldFetchData =
    fid && (!userData || (userData as UserData).fid !== fid);

  if (shouldFetchData && fid) {
    await Promise.all([fetchUserData(fid), timeCreatedAt(fid)]);
  }
  const SplashScreen = () => (
<div tw="flex flex-col w-full h-full bg-[#006994] text-[#f5deb3] font-sans font-bold">
    <div tw="flex items-center items-center justify-center mt-30">
            <img
              src="https://wrpcd.net/cdn-cgi/imagedelivery/BXluQx4ige9GuW0Ia56BHw/17366316-de71-4c9f-a995-b5ae4eaf9800/original"
              alt="Profile"
              tw="w-50 h-50 rounded-lg"
            />
    </div>
      <div tw="flex text-5xl font-bold items-center justify-center mt-20">Check your<img
              src="https://wrpcd.net/cdn-cgi/imagedelivery/BXluQx4ige9GuW0Ia56BHw/542f5c62-bed7-41be-5d48-aa2e6cbc8a00/original"
              alt="Profile"
              tw="w-40 h-20"
            />Followers Count</div>

    </div>
  );


  const ScoreScreen = () => {
    return (
      <div tw="flex flex-col w-full h-full bg-[#006994] text-[#FFDEAD] font-sans">
      
      <div tw="flex items-center justify-center text-white mt-18">
            <img
              src={userData?.profileImageUrl}
              alt="Profile"
              tw="w-30 h-30 rounded-lg mr-4"
            />
            <div tw="flex flex-col">
              <span tw="flex text-5xl">{userData?.profileDisplayName}</span>
              <span tw="flex text-4xl">@{(userData?.username)}</span> </div>
       </div>
      
       <div tw="flex flex-col items-center text-5xl">
     
       <span tw="flex"> <img
              src="https://wrpcd.net/cdn-cgi/imagedelivery/BXluQx4ige9GuW0Ia56BHw/5d831005-505a-492f-58a0-d939705c0200/original"
              alt="Profile"
              tw="w-60 h-30  mr-4"
            /></span>
       <span tw="flex text-4xl text-white">Followers Count </span>

       <span tw="flex text-9xl">{followerCount?.count ?? "N/A"} </span>
       </div>

       <div tw="flex bg-[#FFDEAD] mt-6 text-black w-full justify-end ">
          <div tw="flex text-3xl pr-20">frame by @cashlessman.eth</div>
        
        </div>
      </div>
    );
  };
  const shareText1 = encodeURIComponent(
    `Check Your Live Followers Count \n \nframe by @cashlessman.eth`
);


// const shareText2 = encodeURIComponent(
//   `🎉 ${followerCount?.count} amazing souls in this little corner of the internet! Your support means the world—thanks for being part of this journey. \nframe by @cashlessman.eth`
// );

  const shareUrl1 = `https://warpcast.com/~/compose?text=${shareText1}&embeds[]=https://followers-count.vercel.app/frames`;

  // const shareUrl2 = `https://warpcast.com/~/compose?text=${shareText2}&embeds[]=https://followers-count.vercel.app/frames${
  //   fid ? `?userfid=${fid}` : ""
  // }`;


  const buttons = [];

  if (!userData) {
    buttons.push(
      <Button action="post" target={{ href: `${appURL()}?userfid=${fid}` }}>
        Check Me
      </Button>,
      <Button action="link" target={shareUrl1}>
        Share
      </Button>,
         <Button
         action="link"
         target="https://warpcast.com/cashlessman.eth"
         >
        Builder 👤
       </Button>
      
    );
  } else {
    buttons.push(
      <Button action="post" target={{ href: `${appURL()}?userfid=${fid}` }}>
        Check Me
      </Button>,
      <Button action="link" target={shareUrl1}>
        Share
      </Button>,
         <Button
         action="link"
         target="https://warpcast.com/cashlessman.eth"
         >
        Builder 👤
       </Button>
      
    );
  }

  return {
    image: fid && !error ? <ScoreScreen /> : <SplashScreen /> ,
    buttons: buttons,
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
