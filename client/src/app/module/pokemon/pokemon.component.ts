import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { PokemonService } from '../../core/services/pokemon.service';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, TYPE_COLOR } from '../../core/shared/constants/common.constants';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.scss',
})
export class PokemonComponent {
  @ViewChild('pokeball', { static: true }) pokeballEl!: ElementRef<HTMLDivElement>;
  @ViewChild('pokemonListEl', { static: true }) listEl!: ElementRef<HTMLDivElement>;

  pokemonList: any[] = [];
  displayPokemonList: any[] = [];
  loadedNames = new Set<string>(); // to avoid duplicates
  nextOffset = DEFAULT_OFFSET;
  limit = DEFAULT_LIMIT;
  loading = false;
  loadThreshold = 2000;
  typeList: any[] = [];
  typeColors = TYPE_COLOR;
  genList: any[] = [];
  regionList: any[] = [];

  rotation = 0;
  isDragging = false;
  startAngle = 0;
  isJumping = false;

  selectedPokemon: any;
  selectedTypes: any[] = [];
  searchFormControl: FormControl = new FormControl('');

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private pokemonService: PokemonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setFavicon("favicon.ico"); // Set default favicon
    this.loadPokemon();
    this.loadTypes();
    this.loadRegions();
    this.loadGenerations();

    this.searchFormControl.valueChanges.subscribe((searchTerm: string) => {
      this.displayPokemonList = this.pokemonList.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) || pokemon.id.toString().includes(searchTerm.trim());
      });
      this.selectPokemon(this.displayPokemonList[0]);
    });
  }

  setFavicon(iconUrl: string) {
    const canvas = document.createElement('canvas');
    const size = 128; // Try 32, 48, 64
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

  loadPokemon(pokedex: string = 'letsgo-kanto'): void {
    if (this.loading) return;

    this.loading = true;

    this.pokemonService.getPokemons(this.nextOffset, this.limit, pokedex).subscribe({
      next: (res) => {
        const results = res.data || [];

        this.pokemonList = results;
        this.displayPokemonList = results;

        this.loading = false;

        this.selectPokemon(this.displayPokemonList[0]);

        console.log(results);
      },
      error: () => {
        this.nextOffset -= this.limit;
        this.loading = false;
      },
    });
  }

  loadTypes(): void {
    this.pokemonService.getTypes().subscribe({
      next: (res) => {
        this.typeList = res.data || [];
        console.log(this.typeList);
      },
      error: () => {
        console.error('Error loading Pokemon types');
      },
    });
  }

  // --- Mouse events ---
  startRotate(event: MouseEvent) {
    this.isDragging = true;
    this.startAngle = this.getMouseAngle(event.clientX, event.clientY);
  }

  rotate(event: MouseEvent) {
    this.handleRotateMove(event.clientX, event.clientY);
  }

  stopRotate() {
    this.isDragging = false;
  }

  // --- Touch events ---
  startRotateTouch(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.isDragging = true;
      const touch = event.touches[0];
      this.startAngle = this.getMouseAngle(touch.clientX, touch.clientY);
    }
  }

  rotateTouch(event: TouchEvent) {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.handleRotateMove(touch.clientX, touch.clientY);
    }
  }

  stopRotateTouch() {
    this.isDragging = false;
  }

  // --- Shared rotation logic ---
  private handleRotateMove(clientX: number, clientY: number) {
    if (!this.isDragging) return;

    const currentAngle = this.getMouseAngle(clientX, clientY);
    let delta = currentAngle - this.startAngle;

    // Normalize delta
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    // Update rotation visually
    this.rotation += delta;
    this.startAngle = currentAngle;

    const list = this.listEl.nativeElement;
    const maxScroll = list.scrollHeight - list.clientHeight;

    // Only scroll if movement is significant
    if (Math.abs(delta) > 0.5) {
      const proposedScrollTop = list.scrollTop + delta * 5;
      if (proposedScrollTop >= 0 && proposedScrollTop <= maxScroll) {
        list.scrollTop = proposedScrollTop;
      }

      // Load more if near bottom
      // if (
      //   delta > 0 &&
      //   !this.loading &&
      //   this.hasNextPage &&
      //   proposedScrollTop + list.clientHeight >= list.scrollHeight - this.loadThreshold
      // ) {
      //   const prevHeight = list.scrollHeight;
      //   this.nextOffset += this.limit;
      //   this.loadPokemon();

      //   setTimeout(() => {
      //     list.scrollTop = proposedScrollTop + (list.scrollHeight - prevHeight);
      //   });
      // }
    }
  }

  private getMouseAngle(clientX: number, clientY: number): number {
    const rect = this.pokeballEl.nativeElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  }

  selectPokemon(pokemon: any) {
    this.pokemonService.getPokemon(pokemon.id).subscribe({
      next: (res) => {
        this.selectedPokemon = res.data;

        this.selectedTypes = this.typeList.filter(type =>
          this.selectedPokemon.types.some(t => t.type.name === type.name)
        );

        // Trigger jump after 1 second
        setTimeout(() => {
          this.isJumping = true;

          // Remove the class after animation ends (so it can be retriggered)
          setTimeout(() => {
            this.isJumping = false;
          }, 400); // match animation duration
        }, 300);
      },
      error: () => {
        console.error('Error loading Pokemon details');
      },
    });
  }

  goInPokemon() {
    this.router.navigate(['/pokemon', this.selectedPokemon.id]);
  }

  loadRegions() {
    this.pokemonService.getRegions().subscribe({
      next: (res) => {
        this.regionList = res.data;
        console.log(this.regionList);
      },
      error: () => {
        console.error('Error loading Pokemon regions');
      },
    });
  }

  loadGenerations() {
    this.pokemonService.getGenerations().subscribe({
      next: (res) => {
        this.genList = this.groupByRegionWithMostPokemon(res.data);
        console.log(this.genList);
      },
      error: () => {
        console.error('Error loading Pokemon generations');
      },
    });
  }

  groupByRegionWithMostPokemon(pokedexList: any[]) {
    const regionMap: Record<string, any> = {};

    for (const dex of pokedexList) {
      const region = dex.region?.name ?? "unknown";
      const entryCount = dex.pokemon_entries?.length ?? 0;

      if (!regionMap[region] || entryCount > regionMap[region].pokemon_entries.length) {
        regionMap[region] = dex; // replace with the one that has more entries
      }
    }

    // Format into desired output
    return Object.values(regionMap).map((dex: any) => ({
      region: dex.region?.name,
      pokedex: dex.name,
      version: dex.version_groups?.[0]?.name,
      pokemonList: dex.pokemon_entries,
    }));
  }

  selectedRegion(region: any) {
    this.loadPokemon(region.pokedex);
  }
}
