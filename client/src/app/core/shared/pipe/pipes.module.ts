import { NgModule } from '@angular/core';
import { CapitalizePipe } from './capitalize.pipe';


const components = [
  CapitalizePipe
]

@NgModule({
  declarations: [components],
  exports: [components],
})
export class CustomPipesModule { }
