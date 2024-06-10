import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistasEstudiantesFormComponent } from './vistas-estudiantes-form.component';

describe('VistasEstudiantesFormComponent', () => {
  let component: VistasEstudiantesFormComponent;
  let fixture: ComponentFixture<VistasEstudiantesFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistasEstudiantesFormComponent]
    });
    fixture = TestBed.createComponent(VistasEstudiantesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
