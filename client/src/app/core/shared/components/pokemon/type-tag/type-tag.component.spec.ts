import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeTagComponent } from './type-tag.component';

describe('TypeTagComponent', () => {
  let component: TypeTagComponent;
  let fixture: ComponentFixture<TypeTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeTagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
