import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

<<<<<<< HEAD
=======

>>>>>>> basic
const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Get Started',
    },
  ],
  image: `${process.env.NEXT_PUBLIC_URL}/ying_yang_mid.png`,
  post_url: `${process.env.NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: 'Spotify Testing',
  description: 'LFG',
  openGraph: {
    title: 'mane to main',
    description: 'LFG',
    images: [`${process.env.NEXT_PUBLIC_URL}/ying_yang_mid.png`],
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
