import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'CLAWEAGUE: Part 3 - Teaching Your Claw New Skills',
  description:
    'How to build and deploy custom domain-specific skills for your agentic teammates. Modular intelligence for high-performance evolution.',
  slug: 'claweague-technical-part-3-teaching-claw-new-skills',
});

export default function BlogPost() {
  return <PostClient />;
}
