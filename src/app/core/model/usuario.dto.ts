export interface UsuarioDTO {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female' | string;
  username: string;
  city: string;
  role: 'admin' | 'user' | string;
  image?: string;
  email?: string;
  phone?: string;
}