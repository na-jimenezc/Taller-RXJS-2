import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../../core/model/publicacion.model';

@Component({
  selector: 'app-info-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-posts.html',
  styleUrl: './info-posts.css'
})
export class InfoPosts {
  @Input() posts: Publicacion[] = [];
  @Input() loading = false;
  @Input() error = '';
}
