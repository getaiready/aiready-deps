import { Metadata } from 'next';
import { generateBlogMetadata } from '../../../lib/blog-metadata';
import PostClient from './PostClient';

export const metadata: Metadata = generateBlogMetadata({
  title:
    'CLAWEAGUE: Part 2 - The MCP Handshake: Talking to Your Code Substrate',
  description:
    'Using the Model Context Protocol (MCP) to bridge the gap between your IDE and your autonomous colleague. Real-time collaboration without a clipboard.',
  slug: 'claweague-technical-part-2-talking-to-code-mcp',
});

export default function BlogPost() {
  return <PostClient />;
}
