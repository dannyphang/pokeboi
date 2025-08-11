import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokemonRoutingModule } from './pokemon-routing.module';
import { ComponentsModule } from '../../core/shared/components/components.module';
import { CommonSharedModule } from '../../core/shared/modules/common-shared.module';
import { MaterialModule } from '../../core/shared/modules/material.module';
import { PrimeNgModule } from '../../core/shared/modules/primeng.module';
import { PokemonComponent } from './pokemon.component';


@NgModule({
  declarations: [
    PokemonComponent
  ],
  imports: [
    CommonModule,
    PokemonRoutingModule,
    CommonSharedModule,
    MaterialModule,
    PrimeNgModule,
    ComponentsModule
  ]
})
export class PokemonModule { }
