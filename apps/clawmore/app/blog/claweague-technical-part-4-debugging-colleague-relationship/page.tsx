import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title: 'CLAWEAGUE: Part 4 - Debugging the Colleague Relationship',
  description:
    'Understanding agent reasoning through trace logs and feedback loops. How to align intent with your autonomous silicon teammates.',
  slug: 'claweague-technical-part-4-debugging-colleague-relationship',
});

export default function BlogPost() {
  return <PostClient />;
}
