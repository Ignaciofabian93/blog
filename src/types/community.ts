export interface CommunityCategory {
  id: number;
  category: string;
  subcategories: CommunitySubCategory[];
}

export interface CommunitySubCategory {
  id: number;
  subCategory: string;
  communityCategoryId: number;
  communityCategory: CommunityCategory;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  lastName?: string;
}

export interface Seller {
  id: string;
  email: string;
  sellerType: string;
}

export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  authorId: string;
  images: string[];
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
  author?: Admin;
  communityComments?: CommunityComment[];
}

export interface CommunityComment {
  id: number;
  communityPostId: number;
  sellerId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  communityPost?: CommunityPost;
  seller?: Seller;
}
