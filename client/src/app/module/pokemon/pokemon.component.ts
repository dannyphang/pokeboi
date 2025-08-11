import { Component } from '@angular/core';
import { PokemonService } from '../../core/services/pokemon.service';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.scss'
})
export class PokemonComponent {
  pokemonList = [];
  constructor(
    private pokemonService: PokemonService
  ) { }

  ngOnInit(): void {
    this.pokemonService.getPokemons().subscribe(pokemons => {
      this.pokemonList = pokemons.data || [];
      console.log(this.pokemonList);
    });
  }
}
