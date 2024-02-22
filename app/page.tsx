import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Start the groove',
    },
  ],
  image: `${process.env.NEXT_PUBLIC_URL}dj_arch.png`,
  post_url: `${process.env.NEXT_PUBLIC_URL}api/frame`,
});

export const metadata: Metadata = {
  title: 'Groove Provider',
  description: 'Groove out to some house in frame, why not.',
  openGraph: {
    title: 'Groove Provider',
    description: 'LFG',
    images: [`${process.env.NEXT_PUBLIC_URL}dj_arch.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Groove Provider tm. </h1>
      <h2>House music edition</h2>
    </>
  );
}
