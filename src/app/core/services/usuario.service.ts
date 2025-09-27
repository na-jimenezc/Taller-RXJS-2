
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { App } from '../../app';

import { UsuarioDTO } from '../model/usuario.dto';
import { Usuario } from '../model/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'https://dummyjson.com/';

  constructor(private http: HttpClient) { }

  //Función para buscar por username
  buscarPorUsername(username: string): Observable<UsuarioDTO | null> {

    if (!username || username.trim() === ''){
      return throwError(() => new Error('El username no puede ser nulo'));
    }

    const params = new HttpParams()
      .set('key', 'username')
      .set('value', username.trim());

    //La longitud de los usuarios siempre debe ser mayor a 0 cuando se utiliza esta página,
    //por eso se mapea la lista de todos los que si se encuentran registradps
    return this.http.get<{ users: Usuario[] }>(`${this.baseUrl}/users/filter`, { params })

      //Pipe de filtrado
      .pipe(
        map(response => {
          if (!response.users || response.users.length === 0) {
            return null;
          }
          
          const usuario = response.users[0];
          return this.mapearDTO(usuario);
        }),

        //Para errpres
        catchError(error => {
          console.error('Hubo un error en la búsqueda del usuario:', error);
          return throwError(() => new Error('Error al buscar el usuario. Por favor, intenta nuevamente.'));
        })
      );
  }

  //Función auxiliar para no traerme todos los datos del usuario con ayuda del DTO
  private mapearDTO(usuario: Usuario): UsuarioDTO {
     return{
      firstName: usuario.firstName,
      lastName: usuario.lastName,
      age: usuario.age,
      gender: usuario.gender,
      username: usuario.username,
      city: usuario.address?.city || 'No especificada',
      role: usuario.role,
      image: usuario.image,
      email: usuario.email,
      phone: usuario.phone
    };
  }
}