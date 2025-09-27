import { Component, Input } from '@angular/core';
import { UsuarioDTO } from '../../core/model/usuario.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-usuario',
  imports: [CommonModule],
  templateUrl: './info-usuario.html',
  styleUrls: ['./info-usuario.css']
})
export class InfoUsuario {
  @Input() usuario: UsuarioDTO | null = null;
}
