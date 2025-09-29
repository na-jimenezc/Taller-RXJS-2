import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraBusqueda } from './componentes/barra-busqueda/barra-busqueda';
import { InfoUsuario } from './componentes/info-usuario/info-usuario';
import { UsuarioDTO } from './core/model/usuario.dto';
import { UsuarioService } from './core/services/usuario.service';
import { InfoPosts } from './componentes/info-posts/info-posts';
import { of, switchMap } from 'rxjs';
import { Publicacion } from './core/model/publicacion.model';


@Component({
  selector: 'app-root',
  imports: [CommonModule, BarraBusqueda, InfoUsuario, InfoPosts],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Taller-RXJS-2');

  usuario: UsuarioDTO | null = null;
  loading = false;
  error = '';

  posts: Publicacion[] = [];
  postsLoading = false;
  postsError = '';

  constructor(private usuarioService: UsuarioService) {}

  onBuscarUsuario(username: string): void {

    console.log('Buscando usuario con username:', username);
    this.loading = true;
    this.error = '';
    this.posts = [];
    this.postsError = '';
  
    this.usuarioService.buscarPorUsername(username).subscribe({
      next: (usuarioDTO) => {
        if (!usuarioDTO) {
          this.error = 'Usuario no encontrado. Verifica el username e intenta nuevamente.';
          this.usuario = null;
          this.loading = false;
          return;
        }
        this.usuario = usuarioDTO;
        this.loading = false;

        this.cargarPostsDelUsuario(usuarioDTO.username);
      },
      error: (err) => {
        console.error('Error en búsqueda:', err);
        this.error = err.message;
        this.usuario = null;
        this.loading = false;
      }
    });
  }

  private cargarPostsDelUsuario(username: string) {
    this.postsLoading = true;
    this.postsError = '';

    this.usuarioService.buscarPorUsername(username).pipe(
    switchMap((u: UsuarioDTO | null) => {
      if (!u) return of([] as Publicacion[]);

      return this.usuarioService['http']
      .get<{ users: Array<{ id: number }> }>(
        `https://dummyjson.com/users/filter?key=username&value=${encodeURIComponent(u.username)}`
      )
      .pipe(
        switchMap((resp: { users: Array<{ id: number }> }) => {
          const userId = resp?.users?.[0]?.id ?? 0;
          if (!userId) return of([] as Publicacion[]);
          return this.usuarioService.getPostsWithCommentsByUser(userId);
        })
      );
    })
    ).subscribe({
      next: (pubs: Publicacion[]) => {
        this.posts = pubs;
        this.postsLoading = false;
      },
      error: (err: unknown) => {
        console.error('Error cargando posts:', err);
        this.postsError = 'Error cargando publicaciones.';
        this.postsLoading = false;
      }
    });
  }

  onLimpiarBusqueda(): void {
    this.usuario = null;
    this.error = '';
    this.posts = [];
    this.postsError = '';
  }
}
