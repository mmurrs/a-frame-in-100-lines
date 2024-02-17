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
var token = "";
async function authenticateSpotify() {
  const url = 'https://accounts.spotify.com/api/token';
  const headers = {
    'Authorization': 'Basic ' + btoa(process.env.client_id + ':' + process.env.client_secret),
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  const body = new URLSearchParams();
  body.append('grant_type', 'client_credentials');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if(!response.ok) {
      throw new Error(`Error in Auth response: ${response.statusText}`);
    }

    const data = await response.json();
    token = data.access_token;
    console.log("Token", token);
    console.log("Toklen expires in: data.expires_in");
    } catch(error) {
      console.error('Error ', error);
    }
}

function extractSongInfo(res: any): TrackInfo {
  const track = res.tracks[0];
  const imageURL = track.album.images[0].url;

  const trackInfo: TrackInfo = {
    trackName: track.name,
    artist: track.artists[0].name,
    imageUrl: imageURL,
    playlink: track.external_urls.spotify,
  };

  return trackInfo;
}

// Returns a recommended Spotify song
async function getRecommendedSong() {
  const url = `https://api.spotify.com/v1/recommendations?limit=1&seed_genres=house,progressive-house,deep-house,chicago-house&target_popularity=75`;

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
  }
}

// TOOD
// Authenticate for API token
// Get tracks: house, deep-house, progressive-house, chicago-house

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // Should only request once an hour
  // authenticateSpotify();
  let res: TrackInfo = await getRecommendedSong() as TrackInfo;
  console.log("Res object: ", res)
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'link',
          label: 'Play on Spotify',
          target: res.playlink,
        },
      ],
      image: res.imageUrl,
      post_url: `${process.env.NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
