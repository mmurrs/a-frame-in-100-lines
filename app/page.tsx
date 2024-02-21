import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Start the groove',
    },
  ],
  image: `${process.env.NEXT_PUBLIC_URL}dj_arch_1.png`,
  post_url: `${process.env.NEXT_PUBLIC_URL}api/frame`,
});

export const metadata: Metadata = {
  title: 'Spotify Testing',
  description: 'LFG',
  openGraph: {
    title: 'Groove Provider',
    description: 'LFG',
    images: [`${process.env.NEXT_PUBLIC_URL}dj_arch_1.png`],
  },
  other: {
    ...frameMetadata,
  },
};



export default function Page() {
  return (
    <>
      <h1>Groove Provider</h1>
    </>
  );
}
