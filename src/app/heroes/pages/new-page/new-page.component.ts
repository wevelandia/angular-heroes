import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap, tap } from 'rxjs';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';



@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css'
})

export class NewPageComponent implements OnInit {

  // Definimos nuestro Formulario reactivo
  // nonNullable: true: Esto me indica que superhero siempre va a ser un string y los demas campos si pueden ser nulos.
  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl('')
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  // Angular Material ya viene configurado con los snackbars y se maneja el servicio MatSnackBar
  // Inyectamos el servicio de MatDialog para el manejo de los mensajes.
  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  // Creamos un get para corregir el envio del form por el tipo de datos,
  // this.heroesService.updateHero( this.heroForm.value );  En esta linea sale un mensjae de error es como estar esperando una manzana pero se recibe es una piedra en forma de manzana.
  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    // Cuando se carga debo de validar que url es.
    if ( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id ) ),
      ).subscribe( hero => {
        // Si no existe hero lo saco de esta pagina
        if ( !hero ) return this.router.navigateByUrl('/');

        // Si existe, pasamos nuestro hero a heroForm
        this.heroForm.reset( hero );
        return;

      });

  }

  onSubmit(): void {
    /* console.log({
      formIsValid: this.heroForm.valid,
      value: this.heroForm.value
    }); */

    if ( this.heroForm.invalid ) return;
    //this.heroesService.updateHero( this.heroForm.value );

    // Si currentHero (tambien se puede tomar heroForm pues ambos estan conectados ) tiene un id es que quiere actualizar, sino lo tiene lo va a crear
    if ( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          // TODO: mostrar snackbar
          this.showSnackBar(`${ hero.superhero } updated!`);
        });

    return;

    }

    // Si no es que quiere crear
    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        // TODO: mostrar snackbar, y navegar a /heroes/edit/ hero.id
        this.router.navigate( ['/heroes/edit', hero.id] );
        this.showSnackBar(`${ hero.superhero } created!`);
      });

  }

  // Creo un metodo para mostrar el dialog
  onDeleteHero() {
    if ( !this.currentHero.id ) throw 'Hero id is required';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    // Se usa filter para saber si detenemos o no el proceso
    // El primer filter es cuando doy click en OK.
    // switchMap me retorna un boolean por ello el segundo filter, si es true pasa a la pagina de listado de heroes.
    dialogRef.afterClosed()
      .pipe(
        filter( (result : boolean) => result ),
        switchMap( () => this.heroesService.deleteHeroById( this.currentHero.id ) ),
        filter( (wasDeleted : boolean) => wasDeleted )
        // tap( wasDelete => console.log( {wasDelete} ) )
      )
      .subscribe(result => {
        //console.log({result});
        this.router.navigate( ['/heroes'] );
      });

    // Este código se mejora parano tener un subscribe dentro de otro subscribe.
    /* dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // console.log({ result }); // Este es el resultado del dialogo
      // Si no tenemos un resultado del Dialog no hacemos nada
      if ( !result ) return;

      // Acá llamamos la eliminación del Hero
      this.heroesService.deleteHeroById( this.currentHero.id )
      .subscribe( wasDelete => {
        if ( wasDelete )
          this.router.navigate( ['/heroes'] );
      });
      // Después de eliminado lo pasamos a otra pantalla.

    }); */
  }

  // Creamos un metodo para mostrar el snackbar
  showSnackBar( message: string ): void {
    this.snackbar.open( message, 'done', {
      duration:  2500
    } )
  }
}
