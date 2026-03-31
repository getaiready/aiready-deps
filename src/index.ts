import { ToolRegistry } from '@aiready/core';
import { DEPS_PROVIDER } from './provider';

// Register with global registry
ToolRegistry.register(DEPS_PROVIDER);

export * from './types';
export * from './analyzer';
export * from './scoring';
export { DEPS_PROVIDER };
