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

  fetch(url, {
    method: 'POST',
    headers: headers,
    body: body,
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    token = data.access_token;
    console.log(token);
  })
  .catch(error => console.error('Error:', error));
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
async function getRecommendedSong(){
  const url = `https://api.spotify.com/v1/recommendations?limit=1`;
  try {
    const spotifyResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(spotifyResponse);
    return extractSongInfo(spotifyResponse);
  } catch(error) {
    console.error("Spotify Recommendation Error", error);
  }
}

// TOOD
// Authenticate for API token
// Get tracks: house, deep-house, progressive-house, chicago-house

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let button_2: string | undefined = '';
  let button_3: string | undefined = '';
  let button_4: string | undefined = '';
  
  try {
    // const body: FrameRequest = await req.json();
    const body: FrameActionPayload = await req.json();
    // Get trusted Data
    const frameMessage = await getFrameMessage(body);
    const { isValid, message } = await getMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });    // Thought: Check to see the button that is clicked
    
    console.log("Body: ", body);
    // TODO: See the fid of the person voting
    // TODO: Some way to store the responses?
    if (isValid) {
      accountAddress = message.interactor.verified_accounts[0];
      button_2 = message.following as any;
      button_3 = body.untrustedData.buttonIndex as any;
      button_4 = body.trustedData.messageBytes as any;
      // Get the trusted data from frames
      const decodedMessage = await getFrameMessage(body) as any;
      button_4 = decodedMessage
    } // if
      // Should do something if page 1
      if(body.untrustedData.buttonIndex as number == 1){
        console.log("button 1 pressed");
      } else if (body.untrustedData.buttonIndex as number == 2){
        console.log("button 2 pressed");
      }
    } catch(err) {
      console.error(err);
      // Some response to try again
    }

    
  // TODO: Use Neynar or Airstack to query and get closely related farcasters
  // Maybe who are your top 5 friends 
  // top channels you interact with
  // Searching farcaster in there would be kinda funny
  // you can now do dynamic searches
  // LLM interactions
  // if (isValid) {
  //   accountAddress = message.interactor.verified_accounts[0];
  //   button_2 = message.following as any;
    
  // }
  authenticateSpotify();
  let res: TrackInfo = await getRecommendedSong() as TrackInfo;
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `🌲 ${res.trackName} 🌲`,
        },
        {
          label: `${res.trackName}`,
        }
      ],
      image: `${process.env.BASE_URL}/ying_yang_mid.png`,
      post_url: `${process.env.BASE_URL}/api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
