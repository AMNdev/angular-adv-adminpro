import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { Usuario } from '../models/usuario.model';

declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario: Usuario | undefined;


  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {}

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get uid(): string{
    return this.usuario?.uid || ''
  }

  get headers() {
    return {headers: {
      'x-token': this.token,
    }}
  }

  // logout
  logout() {
    localStorage.removeItem('token');

    // google
    google.accounts.id.revoke('antonio.marqueznovella@gmail.com', () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
    this.router.navigateByUrl('/login');

  }

  // comprobar-validar token
  validarToken(): Observable<boolean> {

    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          const { nombre, email, password, img, google, role, uid } =
            resp.usuario;

          this.usuario = new Usuario(nombre, email, '', img, google, role, uid);

          localStorage.setItem('token', resp.token);
          return true
        }),
        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  actualizarPerfil(data: { email: string, nombre: string, role: string }) {
    
    data = {
      ...data,
      role: this.usuario?.role||''
    }
    
    
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers)
  }



  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      tap(() => this.router.navigateByUrl('/dashboard'))
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        // console.log(resp);
        localStorage.setItem('token', resp.token);
      })
    );
  }

  cargarUsuarios(desde:number=0) {
    const url = `${base_url}/usuarios?desde=${desde}`;

    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        map(resp => {
          const usuarios = resp.usuarios.map(
            user=> new Usuario(user.nombre,user.email,'',user.img, user.google, user.role, user.uid)
          )
          // console.log(resp);          

          return {
            total: resp.total,
            usuarios
          };
      })
    )
    
  }

  eliminarUsuario(usuario: Usuario) {
    // /usuarios/id
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);

  }


  guardarUsuario(usuario:Usuario) {
    
    
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers)
  }
}
