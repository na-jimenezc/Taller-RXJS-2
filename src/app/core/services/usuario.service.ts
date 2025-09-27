
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
}
