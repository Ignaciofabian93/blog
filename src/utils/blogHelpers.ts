// Blog utility functions

export const calculateReadingTime = (content: string): number => {
  // Average reading speed is about 200-250 words per minute
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes); // Minimum 1 minute reading time
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.substr(0, maxLength);
  // Find the last space to avoid cutting words in half
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 0) {
    return truncated.substr(0, lastSpace) + "...";
  }

  return truncated + "...";
};

export const extractExcerpt = (content: string, maxLength: number = 150): string => {
  // Remove HTML tags if present
  const plainText = content.replace(/<[^>]*>/g, "");
  return truncateText(plainText, maxLength);
};

export const validateBlogData = (blogData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!blogData.title || blogData.title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (!blogData.content || blogData.content.trim().length === 0) {
    errors.push("Content is required");
  }

  if (!blogData.slug || blogData.slug.trim().length === 0) {
    errors.push("Slug is required");
  }

  if (!blogData.category) {
    errors.push("Category is required");
  }

  if (!blogData.adminId) {
    errors.push("Admin ID is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
