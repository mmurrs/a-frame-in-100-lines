import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { Message, getSSLHubRpcClient } from "@farcaster/hub-nodejs";
import { Frame, validateFrameMessage, FrameActionPayload } from "frames.js"

const NEXT_PUBLIC_URL = 'https://zizzamia.xyz';
// Creates a client to interact with from the HUB_URL 
let newFrame: Frame = {
  version: "vNext",
  postUrl: "",
  image: "",
  buttons: [
    { label: "Button 1", action: "post" },
    { label: "Button 2", action: "post"}
  ],
  ogImage: "https://spotify-gallery-00.vercel.app/ying_yang_mid.png",
  inputText: "Bob" 
}

const client = process.env.HUB_URL ? getSSLHubRpcClient(process.env.HUB_URL) : undefined;

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = '';
  let button_2: string | undefined = '';
  let button_3: string | undefined = '';
  let button_4: string | undefined = '';
  
  try {
    // const body: FrameRequest = await req.json();
    const body: FrameActionPayload = await req.json();
    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });    // Thought: Check to see the button that is clicked
    
    console.log("Body: ", body);
    // TODO: See the fid of the person voting
    // TODO: Some way to store the responses?
    if (isValid) {
      accountAddress = message.interactor.verified_accounts[0];
      button_2 = message.following as any;
      button_3 = body.untrustedData.buttonIndex as any;
      button_4 = body.trustedData.messageBytes as any;
      const decodedMessage = body.trustedData.messageBytes as any;
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

  // TODO: How to check the label
  // console.log("Frame response: ", message)
  // console.log("Frame Message Raw: ", message?.raw)



  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `🌲 ${accountAddress} 🌲`,
        },
        {
          label: `${button_2}`,
        },
        {
          label: `${button_3}`,
        },
        {
          label: `${button_4}`,
        }
      ],
      image: `https://spotify-gallery-00.vercel.app/ying_yang_mid.png`,
      post_url: `https://spotify-gallery-00.vercel.app/api/frame`,
    }),
  );
}

export async function messageCheck(message) {
  try {
    const response = await fetch(`${process.env.HUB_URL}`)
  }
}
export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
