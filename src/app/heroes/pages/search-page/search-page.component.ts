import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {

  // Para usar FormControl se debe de importar un modulo ReactiveFormModule, se usa para cuando se utilizan formularios reactivos.
  public searchInput = new FormControl('');

  // La implementación del Autocomplete se puede hacer con un observable,
  // pero acá se va a realizar de la forma sencilla.
  // Creamos unapropiedad para almacenar los resultados
  public heroes: Hero[] = [];

  public selectedHero?: Hero;

  constructor( private heroesService: HeroesService ) {}

  searchHero() {
    const value: string = this.searchInput.value || '';

    //console.log({ value });
    // El termino del query es el value.
    this.heroesService.getSuggestions( value )
      .subscribe( heroes => this.heroes = heroes);
  }

  onSelectedOption( event: MatAutocompleteSelectedEvent ): void {
    //console.log(event.option.value);
    if ( !event.option.value ) {
      this.selectedHero = undefined;
      return;
    }

    // Si tememos un Hero
    const hero: Hero = event.option.value;
    this.searchInput.setValue( hero.superhero );

    this.selectedHero = hero;

  }

}
