import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user';
import { Observable, of, tap, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environments.baseURL;
  // Al momento de ingresar a la aplicación puede que este usuario no este conectado por ello se deja opcional (?) el dato.
  private user?: User;

  constructor( private http: HttpClient ) { }

  get currentUser(): User|undefined {
    if ( !this.user ) return undefined;
    //return {...this.user};
    return structuredClone(this.user);
  }

  login( email: string, password: string ):Observable<User> {
    // http.post('login',{email, password});

    return this.http.get<User>( `${ this.baseUrl }/users/1` )
      .pipe(
        tap( user => this.user = user ),
        tap( user => localStorage.setItem( 'token', user.id.toString() ) )
      );
  }

  // Metodo para chequear si un usuario esta autotenticado o no.
  checkAuthentication(): Observable<boolean> {
    if ( !localStorage.getItem('token') ) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap( user => this.user = user ),
        map( user => !!user ),
        catchError( err => of(false) )
      )
  }

  // Cerrar la sesión y borrar mi localStorage
  logout() {
    this.user = undefined;
    localStorage.clear();
  }

}
