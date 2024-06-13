import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'heroesApp';

  // constructor( private authService: AuthService ) {}

  // Implementa esto ya es tarde porque se carga la pagina de listas de Heroes.
  // El objetivo de la autenticación es verificarla antes de que se muestre la información.
  /* ngOnInit(): void {
    this.authService.checkAuthentication().subscribe( () => {
      console.log('checkAuthentication finished');
    })
  } */

}
