import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroImage'
})
export class HeroImagePipe implements PipeTransform {

  transform( hero: Hero): string {

    if ( !hero.id && !hero.alt_img ) {
      return 'assets/no-image.png';
    }

    // Si es un Heroe (la imagen se define dinamicamente de otro lugar o esta dentro de otra carpeta)
    // nuevo la imagen alternativa sería
    if ( hero.alt_img ) return hero.alt_img; // https://google.com/flash.png

    // Esto lo retorno si existe el heroe
    return `assets/heroes/${ hero.id }.jpg`;

  }

}
