import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../../core/services/pokemon.service';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  pokemonId: string | null = null;
  pokemon: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private activatedRoute: ActivatedRoute,
    private pokemonService: PokemonService,
    private titleService: Title,
  ) {
    if (this.activatedRoute.snapshot.queryParamMap) {
      this.pokemonId = this.activatedRoute.snapshot.paramMap.get('id');
      this.pokemonService.getPokemon(this.pokemonId!).subscribe({
        next: (res) => {
          this.pokemon = res.data;
          // set title
          this.titleService.setTitle(this.pokemon.name.charAt(0).toUpperCase() + this.pokemon.name.slice(1));

          // set icon
          this.setFavicon(this.pokemon.sprites.front_default);

          console.log(this.pokemon)
        },
        error: () => {
          console.error('Error loading Pokemon details');
        }
      });
    }
  }

  setFavicon(iconUrl: string) {
    const canvas = document.createElement('canvas');
    const size = 48; // Try 32, 48, 64
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = iconUrl;

    img.onload = () => {
      // Draw image in center of larger canvas
      const offset = (size - img.width) / 2;
      ctx.drawImage(img, offset, offset);

      let link: HTMLLinkElement | null = this.document.querySelector("link[rel*='icon']");
      if (!link) {
        link = this.document.createElement('link');
        link.rel = 'icon';
        this.document.head.appendChild(link);
      }
      link.href = canvas.toDataURL('image/png');
    };
  }

}
