export enum BlogStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum BlogCategoryType {
  RECYCLING = "Reciclaje",
  POLLUTION = "Contaminación",
  SUSTAINABILITY = "Sostenibilidad",
  CIRCULAR_ECONOMY = "Economía Circular",
  USED_PRODUCTS = "Productos Usados",
  REUSE = "Reutilización",
  ENVIRONMENT = "Medio Ambiente",
  UPCYCLING = "Upcycling",
  RESPONSIBLE_CONSUMPTION = "Consumo Responsable",
  ECO_TIPS = "Tips Ecológicos",
  ENVIRONMENTAL_IMPACT = "Impacto Ambiental",
  SUSTAINABLE_LIVING = "Vida Sustentable",
  OTHER = "Otros",
}

export type BlogCategory = {
  id: number;
  name: string;
};

export type Blog = {
  id: number;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // Optional: relation to Admin
  Admin?: {
    id: string;
    name: string;
    email: string;
  };
};

export type BlogComment = {
  id: number;
  comment: string;
  userId: string;
  blogId: number;
  createdAt: Date;
};

export type BlogLike = {
  id: number;
  userId: string;
  blogId: number;
  createdAt: Date;
};

export type Admin = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
