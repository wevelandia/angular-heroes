import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styleUrl: './hero-page.component.css'
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero;

  // Inyectamos nuestro servicio
  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
   ) {}

  // De los params tomamos el id que es el que nos interesa
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id ) ) // Si esto da error me regresa un undefined
      ).subscribe( hero => {
        // console.log( { params } );
        if ( !hero ) return this.router.navigate([ '/heroes/list' ]);

        this.hero = hero;
        //console.log({ hero });
        return;
      });
  }

  goBack(): void {
    this.router.navigateByUrl('heroes/list');
  }

}
