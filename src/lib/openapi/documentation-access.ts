// Documentation access utilities for serving agent-discovery documents
// This module provides functionality for accessing and serving documentation
// under /.well-known/* and /auth.md endpoints.

export const getDocumentationAccess = () => {
  return {
    isAccessible: true,
    timestamp: new Date().toISOString(),
  };
};

export default getDocumentationAccess;
