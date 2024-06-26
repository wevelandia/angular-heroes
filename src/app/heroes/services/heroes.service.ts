import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private baseURL: string = environments.baseURL;

  constructor(private http: HttpClient) { }

  getHeroes():Observable<Hero[]> {
    return this.http.get<Hero[]>(`${ this.baseURL }/heroes`)
  }

  // Puede venir un Hero o puede venir un undefined,
  // es decir que el usuario ingresa directamente a la pantalla
  // y coloca un heroe que no existe or ejemplo: http://localhost:3000/heroes/d-flash
  // Manejamos el pipe para capturar un error, si da error regreso un observable: of(undefined)
  getHeroById( id: string ):Observable< Hero | undefined > {
    return this.http.get<Hero>(`${ this.baseURL }/heroes/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  // Creamos nuestro autocomplete
  getSuggestions( query: string ): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${ this.baseURL }/heroes?q=${ query }&_limit=6`);
  }

  // Creamos los tres CRUD faltantes
  addHero( hero: Hero): Observable<Hero> {
    // Este EndPoint se llama el metodo post y se le envia como params el hero.
    return this.http.post<Hero>(`${ this.baseURL }/heroes`, hero);
  }

  updateHero( hero: Hero): Observable<Hero> {
    // Este EndPoint actualiza parcialmente el objeto, los campos que le envie.
    if ( !hero.id ) throw Error('Hero id is required');

    return this.http.patch<Hero>(`${ this.baseURL }/heroes/${ hero.id }`, hero);
  }

  deleteHeroById( id: string): Observable<boolean> {
    // Si cae en un error por ejemplo que se trata de borrar un Hero que no existe pasa por: catchError
    // Si no presenta error pasa a map y me retorna un true.
    return this.http.delete(`${ this.baseURL }/heroes/${ id }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) )
      );
  }
}
