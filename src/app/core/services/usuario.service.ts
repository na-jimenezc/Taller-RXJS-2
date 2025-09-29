import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  of,
  throwError,
  catchError,
  map,
  switchMap,
  forkJoin
} from 'rxjs';

import { UsuarioDTO } from '../model/usuario.dto';
import { Usuario } from '../model/usuario.model';
import { Publicacion } from '../model/publicacion.model';
import { Comentario } from '../model/comentario.model';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = 'https://dummyjson.com/users';

  constructor(private http: HttpClient) { }

  //Función para buscar por username
  buscarPorUsername(username: string): Observable<UsuarioDTO | null> {
      const url = `${this.apiUrl}/filter?key=username&value=${username}`;
      console.log('URL consulta:', url);

      return this.http.get<{ users: Usuario[] }>(url).pipe(
      map((resp) => {
          console.log('Respuesta API completa:', resp);

          if (!resp.users || resp.users.length === 0) {
          console.warn('Usuario no encontrado');
          return null;
          }

          const u = resp.users[0];
          console.log('Usuario encontrado:', u);

          const dto: UsuarioDTO = {
          firstName: u.firstName,
          lastName: u.lastName,
          age: u.age,
          gender: u.gender,
          username: u.username,
          city: u.address?.city || '',
          role: u.role,
          image: u.image,
          email: u.email,
          phone: u.phone
          };

          console.log('UsuarioDTO generado:', dto);
          return dto;
      }),
      catchError((err) => {
          console.error('Error en la API:', err);
          return throwError(() => new Error('Error en la consulta de usuario'));
      })
      );
  }

  getPostsByUser(userId: number) {
    return this.http
      .get<{ posts: any[] }>(`https://dummyjson.com/posts/user/${userId}`)
      .pipe(map(r => r.posts ?? []));
  }

  getCommentsByPost(postId: number) {
    return this.http
      .get<{ comments: any[] }>(`https://dummyjson.com/comments/post/${postId}`)
      .pipe(map(r => r.comments ?? []));
  }

  getPostsWithCommentsByUser(userId: number): Observable<Publicacion[]> {
    return this.getPostsByUser(userId).pipe(
      switchMap((posts: any[]) => {
        if (!posts || posts.length === 0) {
          return of([] as Publicacion[]);
        }

        const perPost$ = posts.map((p: any) =>
          this.getCommentsByPost(p.id).pipe(
            map((comments: any[]) => {
              const likes =
                typeof p.reactions === 'number'
                  ? p.reactions
                  : (p.reactions?.likes ?? 0);
              const dislikes =
                typeof p.reactions === 'object'
                  ? (p.reactions?.dislikes ?? 0)
                  : 0;

              const pub: Publicacion = {
                id: p.id,
                title: p.title,
                body: p.body,
                tags: p.tags ?? [],
                reactions: { likes: Number(likes) || 0, dislikes: Number(dislikes) || 0 },
                views: Number(p.views ?? 0),
                userId: p.userId,
                comentarios: (comments ?? []).map((c: any) => {
                  const com: Comentario = {
                    id: c.id,
                    body: c.body,
                    postId: c.postId,
                    likes: 0,
                    user: {
                      id: c.user?.id ?? 0,
                      username: c.user?.username ?? `user-${c.user?.id ?? 0}`,
                      fullName: ''
                    }
                  };
                  return com;
                })
              };
              return pub;
            })
          )
        );
        return forkJoin(perPost$);
      })
    );
  }
}