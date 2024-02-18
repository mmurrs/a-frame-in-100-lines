import { FrameRequest, getFrameMessage as getMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { Message, getSSLHubRpcClient } from "@farcaster/hub-nodejs";
import { Frame, validateFrameMessage, FrameActionPayload, getFrameMessage } from "frames.js"

interface TrackInfo {
  trackName: string;
  artist: string;
  imageUrl: string;
  playlink: string;
}

// Globals
let counter = 0;

var token = "";
function extractSongInfo(res: any): TrackInfo[] {
  // const track = res.tracks[0];
  // const imageURL = track.album.images[0].url;


  // const trackInfo: TrackInfo = {
  //   trackName: track.name,
  //   artist: track.artists[0].name,
  //   imageUrl: imageURL,
  //   playlink: track.external_urls.spotify,
  // };

  // return trackInfo;
  return res.tracks.map((track: any) => {
    const imageURL = track.album.images[0].url;
    return {
      trackName: track.name,
      artist: track.artists[0].name,
      imageUrl: imageURL,
      playlink: track.external_urls.spotify,
    };
  });
}

// Returns a recommended Spotify song
async function getRecommendedSong(): Promise<TrackInfo[]> {
  const url = `https://api.spotify.com/v1/recommendations?limit=100&seed_genres=house,progressive-house,deep-house,chicago-house&min_popularity=30`;

  try {
    const spotifyResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.SPOTIFY_TOKEN}` // Ensure this is the actual token
      }
    });

    if (!spotifyResponse.ok) {
      throw new Error(`Spotify API responded with status ${spotifyResponse.status}: ${spotifyResponse.statusText}`);
    }

    const data = await spotifyResponse.json(); // Parse JSON response
    return extractSongInfo(data); // Assuming extractSongInfo is designed to work with the parsed JSON
  } catch (error) {
    console.error("Spotify Recommendation Error:", error);
    return [];
  }
}

// TOOD
// Authenticate for API token
// Get tracks: house, deep-house, progressive-house, chicago-house
async function getResponse(req: NextRequest): Promise<NextResponse> {
  counter++;
  process.env.TEST = counter as any;

  let res: TrackInfo[] = await getRecommendedSong() as TrackInfo[];
  // Should only request once an hour
  // authenticateSpotify();
  console.log("Res object: ", res)
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'link',
          label: 'Play on Spotify',
          target: res[counter % 100].playlink,
        },
        {
          action: 'post',
          label: 'Spin the Record'
        }
      ],
      image: res[counter % 100].imageUrl,
      post_url: `${process.env.NEXT_PUBLIC_URL}api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
