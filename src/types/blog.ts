export enum BlogTypeEnum {
  RECYCLING,
  POLLUTION,
  SUSTAINABILITY,
  CIRCULAR_ECONOMY,
  USED_PRODUCTS,
  REUSE,
  ENVIRONMENT,
  UPCYCLING,
  RESPONSIBLE_CONSUMPTION,
  ECO_TIPS,
  ENVIRONMENTAL_IMPACT,
  SUSTAINABLE_LIVING,
  OTHER,
  SECURITY,
}

export enum BlogType {
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
  SECURITY = "Seguridad",
}

export type BlogCategory = {
  id: number;
  name: string;
  icon: string;
  description: string;
};

export type BlogPost = {
  id: number;
  title: string;
  content: string;
  authorId: string;
  isPublished: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  category: BlogCategory;
  author: Admin;
  likes: number;
  dislikes: number;
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
