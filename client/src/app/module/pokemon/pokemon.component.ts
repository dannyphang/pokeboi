import { Component, ElementRef, ViewChild } from '@angular/core';
import { PokemonService } from '../../core/services/pokemon.service';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, TYPE_COLOR } from '../../core/shared/constants/common.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.scss',
})
export class PokemonComponent {
  @ViewChild('pokeball', { static: true }) pokeballEl!: ElementRef<HTMLDivElement>;
  @ViewChild('pokemonListEl', { static: true }) listEl!: ElementRef<HTMLDivElement>;

  pokemonList: any[] = [];
  loadedNames = new Set<string>(); // to avoid duplicates
  hasNextPage = false;
  nextOffset = DEFAULT_OFFSET;
  limit = DEFAULT_LIMIT;
  loading = false;
  loadThreshold = 2000;
  typeList: any[] = [];
  typeColors = TYPE_COLOR;

  rotation = 0;
  isDragging = false;
  startAngle = 0;
  isJumping = false;

  selectedPokemon: any;
  selectedTypes: any[] = [];

  constructor(
    private pokemonService: PokemonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPokemon();
    this.loadTypes();
  }

  loadPokemon(): void {
    if (this.loading) return;

    this.loading = true;

    this.pokemonService.getPokemons(this.nextOffset, this.limit).subscribe({
      next: (res) => {
        const results = res.data.results || [];

        this.pokemonList.push(...results);

        this.hasNextPage = !!res.data.next;
        this.loading = false;

        if (!this.selectedPokemon) {
          this.selectPokemon(this.pokemonList[0]);
        }

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
      if (
        delta > 0 &&
        !this.loading &&
        this.hasNextPage &&
        proposedScrollTop + list.clientHeight >= list.scrollHeight - this.loadThreshold
      ) {
        const prevHeight = list.scrollHeight;
        this.nextOffset += this.limit;
        this.loadPokemon();

        setTimeout(() => {
          list.scrollTop = proposedScrollTop + (list.scrollHeight - prevHeight);
        });
      }
    }
  }

  private getMouseAngle(clientX: number, clientY: number): number {
    const rect = this.pokeballEl.nativeElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
  }

  selectPokemon(pokemon: any) {
    this.selectedPokemon = pokemon;

    this.selectedTypes = this.typeList.filter(type =>
      pokemon.types.some(t => t.type.name === type.name)
    );

    // Trigger jump after 1 second
    setTimeout(() => {
      this.isJumping = true;

      // Remove the class after animation ends (so it can be retriggered)
      setTimeout(() => {
        this.isJumping = false;
      }, 400); // match animation duration
    }, 300);
  }

  goInPokemon() {
    this.router.navigate(['/pokemon', this.selectedPokemon.id]);
  }
}
