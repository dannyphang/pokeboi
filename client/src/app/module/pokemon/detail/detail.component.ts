import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../../../core/services/pokemon.service';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { STATS_NAME, TYPE_COLOR } from '../../../core/shared/constants/common.constants';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  pokemonId: string | null = null;
  pokemon: any;
  typeList: any[] = [];
  typeColors = TYPE_COLOR;
  allTypes: any[] = [];
  abilities: any[] = [];
  chartData: any;
  chartOptions: any;
  chartPlugins: any;
  statsNames = STATS_NAME
  versionList: string[] = [];
  typeRelationalList: any;
  moveList: any[] = [];
  displayMoveList: any[] = [];

  searchMoveFormControl: FormControl = new FormControl('');
  isJumping = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private activatedRoute: ActivatedRoute,
    private pokemonService: PokemonService,
    private titleService: Title,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.pokemonId = params.get('id');
      if (this.pokemonId) {
        this.loadPokemon(this.pokemonId);
      }
    });

    this.searchMoveFormControl.valueChanges.subscribe(value => {
      this.displayMoveList = this.moveList.filter(move => {
        const moveName = this.returnMoveNameByLang(move);
        return moveName.toLowerCase().includes(value.toLowerCase());
      });
    })
  }

  loadPokemon(pokemonId: string) {
    this.pokemonService.getPokemon(pokemonId).subscribe({
      next: (res) => {
        this.pokemon = res.data;

        // Trigger jump after 1 second
        setTimeout(() => {
          this.isJumping = true;

          // Remove the class after animation ends (so it can be retriggered)
          setTimeout(() => {
            this.isJumping = false;
          }, 400); // match animation duration
        }, 100);

        // set title
        this.titleService.setTitle(this.pokemon.name.charAt(0).toUpperCase() + this.pokemon.name.slice(1));

        // set icon
        this.setFavicon(this.pokemon.sprites.front_default);

        // set type
        this.loadTypes();

        // set abilities
        this.setAbilities();

        // set stat
        this.setStat();

        // set versions
        this.loadVersionList();

        // load moves
        this.loadMoves();

        console.log(this.pokemon)
      },
      error: () => {
        console.error('Error loading Pokemon details');
      }
    });
  }

  prevPokemon() {
    this.router.navigate(['/pokemon', this.pokemon.id - 1]);
  }

  nextPokemon() {
    this.router.navigate(['/pokemon', this.pokemon.id + 1]);
  }

  setFavicon(iconUrl: string) {
    const canvas = document.createElement('canvas');
    const size = 64; // Try 32, 48, 64
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

  loadTypes(): void {
    this.pokemonService.getTypes().subscribe({
      next: (res) => {
        this.typeList = res.data.filter(type =>
          this.pokemon.types.some(t => t.type.name === type.name)
        ) || [];

        this.allTypes = res.data.map(type => type.name);
        this.allTypes = this.allTypes.filter(type => type !== 'unknown' && type !== 'shadow' && type !== 'stellar');
        this.calculateTypeRelational();
      },
      error: () => {
        console.error('Error loading Pokemon types');
      },
    });
  }

  calculateTypeRelational() {
    let typeRelational = [];
    typeRelational = this.pokemon.type_relational.map((type) => {
      return { name: type.name, relations: type.damage_relations };
    });
    this.typeRelationalList = this.calculateFinalTypeMultipliers(typeRelational);
  }

  calculateFinalTypeMultipliers(typeRelational: any[]): Record<string, number> {
    const allTypes = new Set<string>();

    // Step 1: Collect all possible attack types from the data
    typeRelational.forEach(type => {
      Object.values(type.relations).forEach((arr: any) => {
        arr.forEach((t: any) => allTypes.add(t.name));
      });
    });

    // Step 2: Calculate combined multipliers
    const multipliers: Record<string, number> = {};

    allTypes.forEach(attackType => {
      let multiplier = 1;

      for (const pokemonType of typeRelational) {
        if (pokemonType.relations.no_damage_from.some(t => t.name === attackType)) {
          multiplier = 0;
          break;
        }
        if (pokemonType.relations.double_damage_from.some(t => t.name === attackType)) {
          multiplier *= 2;
        }
        if (pokemonType.relations.half_damage_from.some(t => t.name === attackType)) {
          multiplier *= 0.5;
        }
      }

      multipliers[attackType] = multiplier;
    });

    console.log(multipliers)
    return multipliers;
  }

  returnTypeEffectiveness(effectiveness: number): string[] {
    if (!this.typeRelationalList) {
      return [];
    }

    return this.allTypes.filter(type => {
      const multiplier = this.typeRelationalList[type];

      if (effectiveness === 1) {
        // If the type is missing → assume 1
        return multiplier === 1 || multiplier === undefined;
      }

      return multiplier === effectiveness;
    });
  }
  setAbilities() {
    this.abilities = this.pokemon.abilities.map(ability => {
      return { name: ability.ability.name, hidden: ability.is_hidden };
    });
  }

  setStat() {
    this.chartData = {
      labels: this.pokemon.stats.map(stat => {
        return this.statsNames[stat.stat.name];
      }),
      datasets: [
        {
          data: this.pokemon.stats.map(stat => {
            return stat.base_stat;
          }),
          fill: true,
          borderColor: this.pokemon.species?.color.name,
          // borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ],
    }

    this.chartOptions = {
      plugins: {
        title: {
          display: false // hide title
        },
        legend: {
          display: false // hide legend if needed
        }
      },
      scales: {
        r: {
          angleLines: {
            display: true
          },
          beginAtZero: true,
          min: 0,
          max: 255,
          ticks: {
            display: false
          }
        }
      },

    }

    this.chartPlugins = {
      title: {
        display: false
      },
    }
  }

  loadVersionList() {
    this.pokemonService.getVersions().subscribe({
      next: (res) => {
        this.versionList = res.data.results.map(version => version.name);
      },
      error: () => {
        console.error('Error loading Pokemon versions');
      },
    });
  }

  loadMoves() {
    if (this.pokemonId) {
      this.pokemonService.getMoves(this.pokemonId).subscribe({
        next: (res) => {
          this.moveList = res.data;
          this.displayMoveList = res.data;
        },
        error: () => {
          console.error('Error loading Pokemon moves');
        },
      });
    }
  }

  returnMoveNameByLang(move: any): string {
    const langEntry = move.names.find((name: any) => name.language.name === this.pokemonService.language);
    return langEntry ? langEntry.name : move.names[0].name;
  }

  returnMoveDescByLang(move: any): string {
    const langEntry = move.flavor_text_entries.find((entry: any) => entry.language.name === this.pokemonService.language);
    return langEntry ? langEntry.flavor_text : move.flavor_text_entries[0].flavor_text;
  }

  returnCatColorByName(carName: string): string {
    switch (carName) {
      case 'physical':
        return '#ff0000'; // red
      case 'special':
        return '#0000ff'; // blue
      case 'status':
        return '#00ff00'; // green
      default:
        return '#000000'; // black for unknown categories
    }

  }
}
