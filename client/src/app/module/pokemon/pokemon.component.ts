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
  typeList: any[] = [];
  typeColors = TYPE_COLOR;
  genList: any[] = [];
  regionList: any[] = [];

  // component.ts
  rotation = 0;
  isDragging = false;
  startAngle = 0;
  scrollThumbTop = 0;

  // Keep track of accumulated rotation
  private accumulatedDelta = 0;
  scrollThumbHeight = 40; // px height of thumb
  private isThumbDragging = false;
  private thumbStartY = 0;
  private listStartScroll = 0;
  selectedIndex = 0;
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

  ngAfterViewInit() {
    const list = this.listEl.nativeElement;
    list.addEventListener('scroll', () => {
      const maxScroll = list.scrollHeight - list.clientHeight;
      this.scrollThumbTop = (list.scrollTop / maxScroll) * 100;
    });
  }

  // ------------------- Custom Scroll Thumb -------------------
  startThumbDrag(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.isThumbDragging = true;

    this.thumbStartY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    this.listStartScroll = this.listEl.nativeElement.scrollTop;

    this.document.addEventListener('mousemove', this.onThumbMove);
    this.document.addEventListener('mouseup', this.stopThumbDrag);

    this.document.addEventListener('touchmove', this.onThumbMove, { passive: false });
    this.document.addEventListener('touchend', this.stopThumbDrag);
  }

  onThumbMove = (event: MouseEvent | TouchEvent) => {
    if (!this.isThumbDragging) return;

    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const deltaY = clientY - this.thumbStartY;

    const list = this.listEl.nativeElement;
    const maxScroll = list.scrollHeight - list.clientHeight;
    const trackHeight = list.clientHeight - this.scrollThumbHeight;

    // translate thumb movement into scrollTop
    const scrollDelta = (deltaY / trackHeight) * maxScroll;
    list.scrollTop = this.listStartScroll + scrollDelta;
  };

  stopThumbDrag = () => {
    this.isThumbDragging = false;

    this.document.removeEventListener('mousemove', this.onThumbMove);
    this.document.removeEventListener('mouseup', this.stopThumbDrag);

    this.document.removeEventListener('touchmove', this.onThumbMove);
    this.document.removeEventListener('touchend', this.stopThumbDrag);
  };

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

    // Accumulate rotation
    this.accumulatedDelta += delta;

    // Check threshold (15 degrees for example)
    const threshold = 50;

    if (this.accumulatedDelta >= threshold) {
      this.selectNextPokemon();
      this.accumulatedDelta = 0; // reset
    } else if (this.accumulatedDelta <= -threshold) {
      this.selectPreviousPokemon();
      this.accumulatedDelta = 0; // reset
    }
  }

  private getMouseAngle(clientX: number, clientY: number): number {
    const rect = this.pokeballEl.nativeElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  }

  private scrollToSelected() {
    const list = this.listEl.nativeElement;
    const selectedEl = list.children[this.selectedIndex] as HTMLElement;
    if (selectedEl) {
      list.scrollTo({
        top: selectedEl.offsetTop - 110,
        behavior: 'smooth'
      });
    }
  }

  selectPokemon(pokemon: any, index?: number) {
    this.pokemonService.getPokemon(pokemon.id).subscribe({
      next: (res) => {
        this.selectedPokemon = res.data;

        if (index !== undefined) {
          this.selectedIndex = index; // sync index on click
        }

        this.selectedTypes = this.typeList.filter(type =>
          this.selectedPokemon.types.some(t => t.type.name === type.name)
        );

        this.scrollToSelected();

        setTimeout(() => {
          this.isJumping = true;
          setTimeout(() => (this.isJumping = false), 400);
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

  selectNextPokemon() {
    if (this.displayPokemonList.length === 0) return;

    if (this.selectedIndex < this.displayPokemonList.length - 1) {
      this.selectedIndex++;
      this.selectPokemon(this.displayPokemonList[this.selectedIndex]);
    }
  }

  selectPreviousPokemon() {
    if (this.displayPokemonList.length === 0) return;

    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this.selectPokemon(this.displayPokemonList[this.selectedIndex]);
    }
  }
}
