import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Get Started',
    },
  ],
  image: `https://spotify-gallery-00.vercel.app/ying_yang_mid.png`,
  post_url: `https://spotify-gallery-00.vercel.app/api/frame`,
});

export const metadata: Metadata = {
  title: 'Spotify Testing',
  description: 'LFG',
  openGraph: {
    title: 'mane to main',
    description: 'LFG',
    images: [`https://spotify-gallery-00.vercel.app/ying_yang_mid.png`],
  },
  other: {
    ...frameMetadata,
  },
};



export default function Page() {
  return (
    <>
      <h1>mane to main</h1>
    </>
  );
}
