
import { Comentario } from "./comentario.model";
export interface Publicacion {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;

  comentarios?: Comentario[];
}