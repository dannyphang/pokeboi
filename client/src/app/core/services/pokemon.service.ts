import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { CoreHttpService, ResponseModel } from "./core-http.service";

@Injectable({ providedIn: 'root' })
export class PokemonService {
    SERVICE_PATH_URL = 'pokemon'
    language: string = 'en';
    version: string = 'diamond-pearl';

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
}