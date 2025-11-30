export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date | null;
  role: string;
  image?: string | null;
}

export interface ProductImage {
  id: number;
  url: string;
  productId: string;
}
