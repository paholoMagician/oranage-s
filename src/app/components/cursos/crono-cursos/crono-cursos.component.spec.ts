import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronoCursosComponent } from './crono-cursos.component';

describe('CronoCursosComponent', () => {
  let component: CronoCursosComponent;
  let fixture: ComponentFixture<CronoCursosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CronoCursosComponent]
    });
    fixture = TestBed.createComponent(CronoCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
