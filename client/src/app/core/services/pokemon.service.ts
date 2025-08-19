import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CoreHttpService, ResponseModel } from "./core-http.service";

@Injectable({ providedIn: 'root' })
export class PokemonService {
    SERVICE_PATH_URL = 'pokemon'
    language: string = 'en';
    version: string = 'diamond-pearl';
    private versionSubject = new BehaviorSubject<string>({} as string);
    public versionEvent$ = this.versionSubject.asObservable();
    private languageSubject = new BehaviorSubject<string>({} as string);
    public languageEvent$ = this.languageSubject.asObservable();
    private pokemonSubject = new BehaviorSubject<any>({} as any);
    public pokemonEvent$ = this.pokemonSubject.asObservable();

    set versionEvents(event: string) {
        this.versionSubject.next(event);
    }

    get versionEvents(): string {
        return this.versionSubject.value;
    }

    set languageEvents(event: string) {
        this.languageSubject.next(event);
    }

    get languageEvents(): string {
        return this.languageSubject.value;
    }

    set pokemonEvents(event: any) {
        this.pokemonSubject.next(event);
    }

    get pokemonEvents(): any {
        return this.pokemonSubject.value;
    }

    constructor(
        private http: HttpClient,
        private coreService: CoreHttpService,
    ) {

    }

    getPokemons(offset: number, limit: number): Observable<ResponseModel<any>> {
        return this.coreService.get<any>(this.SERVICE_PATH_URL, { headers: { offset: offset, limit: limit } }).pipe();
    }

    getPokemon(id: string): Observable<ResponseModel<any>> {
        return this.coreService.get<any>(`${this.SERVICE_PATH_URL}/detail/${id}`).pipe();
    }

    getTypes(): Observable<ResponseModel<any>> {
        return this.coreService.get<any>(`${this.SERVICE_PATH_URL}/type`).pipe();
    }

    getVersions(): Observable<ResponseModel<any>> {
        return this.coreService.get<any>(`${this.SERVICE_PATH_URL}/version`).pipe();
    }

    getMoves(id: string): Observable<ResponseModel<any>> {
        return this.coreService.get<any>(`${this.SERVICE_PATH_URL}/move/${id}`).pipe();
    }

    getEvolutionChain(url: string): Observable<ResponseModel<any>> {
        return this.coreService.get<any>(`${this.SERVICE_PATH_URL}/evolution`, { headers: { url: url } }).pipe();
    }

    getEncounterLocation(url: string): Observable<ResponseModel<any>> {
        console.log(url)
        return this.coreService.get<any>(`${this.SERVICE_PATH_URL}/encounter`, { headers: { url: url } }).pipe();
    }
}