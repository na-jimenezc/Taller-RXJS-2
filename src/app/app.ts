import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraBusqueda } from './componentes/barra-busqueda/barra-busqueda';
import { InfoUsuario } from './componentes/info-usuario/info-usuario';
import { UsuarioDTO } from './core/model/usuario.dto';
import { UsuarioService } from './core/services/usuario.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, BarraBusqueda,InfoUsuario],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Taller-RXJS-2');

  
  usuario: UsuarioDTO | null = null;
  loading = false;
  error = '';

  constructor(private usuarioService: UsuarioService) {}

  onBuscarUsuario(username: string): void {
    this.loading = true;
    this.error = '';
    this.usuario = null;

    this.usuarioService.buscarPorUsername(username).subscribe({
      next: (usuarioDTO) => {
        if (!usuarioDTO) {
          this.error = 'Usuario no encontrado. Verifica el username e intenta nuevamente.';
        } else {
          this.usuario = usuarioDTO;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  onLimpiarBusqueda(): void {
    this.usuario = null;
    this.error = '';
  }
  
}
