import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AulasEducativasComponent } from './aulas-educativas.component';

describe('AulasEducativasComponent', () => {
  let component: AulasEducativasComponent;
  let fixture: ComponentFixture<AulasEducativasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AulasEducativasComponent]
    });
    fixture = TestBed.createComponent(AulasEducativasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
