import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'CLAWEAGUE: Part 1 - Provisioning Your Pair Programmer in 60 Seconds',
  description:
    'How to automate infrastructure for your AI agents via AWS account vending and SST. Isolation, security, and one-click teammate setup.',
  slug: 'claweague-technical-part-1-provisioning-pair-programmer',
});

export default function BlogPost() {
  return <PostClient />;
}
