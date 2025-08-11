import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs";
import { CoreHttpService, ResponseModel } from "./core-http.service";

@Injectable({ providedIn: 'root' })
export class PokemonService {
    SERVICE_PATH_URL = 'pokemon'

    constructor(
        private http: HttpClient,
        private coreService: CoreHttpService,
    ) {

    }

    getPokemons(): Observable<ResponseModel<any[]>> {
        return this.coreService.get<any[]>(this.SERVICE_PATH_URL).pipe();
    }
}