import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonSettingComponent } from './pokemon-setting.component';

describe('PokemonSettingComponent', () => {
  let component: PokemonSettingComponent;
  let fixture: ComponentFixture<PokemonSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PokemonSettingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PokemonSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
