import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImgInstitucionesComponent } from './modal-img-instituciones.component';

describe('ModalImgInstitucionesComponent', () => {
  let component: ModalImgInstitucionesComponent;
  let fixture: ComponentFixture<ModalImgInstitucionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalImgInstitucionesComponent]
    });
    fixture = TestBed.createComponent(ModalImgInstitucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
