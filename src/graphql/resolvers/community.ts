import { CommunityService } from "../services/community";

export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export type CreateCommunityPostInput = {
  title: string;
  content: string;
  images?: string[];
};

export type UpdateCommunityPostInput = {
  id: number;
  title?: string;
  content?: string;
  images?: string[];
};

export type CreateCommunityCommentInput = {
  postId: number;
  content: string;
};

export type UpdateCommunityCommentInput = {
  id: number;
  content: string;
};

export const CommunityResolver = {
  Query: {
    communityCatalog: () => CommunityService.getCommunityCatalog(),
    communityCategories: () => CommunityService.getCommunityCategories(),
    communityPosts: (_parent: unknown, _args: PaginationInput) => CommunityService.getCommunityPosts(_args),
    communityPost: (_parent: unknown, _args: { id: number }) => CommunityService.getCommunityPost(_args),
    communityPostsByAuthor: (_parent: unknown, _args: { authorId: string } & PaginationInput) =>
      CommunityService.getCommunityPostsByAuthor(_args),
    communityComments: (_parent: unknown, _args: { postId: number } & PaginationInput) =>
      CommunityService.getCommunityComments(_args),
  },
  Mutation: {
    createCommunityPost: (_parent: unknown, _args: CreateCommunityPostInput) =>
      CommunityService.createCommunityPost(_args),
    updateCommunityPost: (_parent: unknown, _args: UpdateCommunityPostInput) =>
      CommunityService.updateCommunityPost(_args),
    deleteCommunityPost: (_parent: unknown, _args: { id: number }) => CommunityService.deleteCommunityPost(_args),
    likeCommunityPost: (_parent: unknown, _args: { id: number }) => CommunityService.likeCommunityPost(_args),
    createCommunityComment: (_parent: unknown, _args: CreateCommunityCommentInput) =>
      CommunityService.createCommunityComment(_args),
    updateCommunityComment: (_parent: unknown, _args: UpdateCommunityCommentInput) =>
      CommunityService.updateCommunityComment(_args),
    deleteCommunityComment: (_parent: unknown, _args: { id: number }) => CommunityService.deleteCommunityComment(_args),
  },
};
