import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EstudiantesService } from './services/estudiantes.service';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})
export class EstudiantesComponent implements OnInit {

  _show_spinner: boolean = false;
  action_button: string = 'Crear';

  public estudianteForm = new FormGroup (
    {
      nombre:       new FormControl(''),
      edad:         new FormControl(1),
      cedula:       new FormControl(''),
      email:        new FormControl(''),
      alias:        new FormControl(''),
      telefono:     new FormControl(''),
      observacion:  new FormControl('')
    }
  );
  
  constructor( private est:EstudiantesService ) {}
  
  ngOnInit(): void {
    
  }
  
  guardarEstudiante() {

  }

  actualizarEstudiante() {}

  limpiar() {}
  
  submit() {
    switch(this.action_button) {
      case 'Crear':
        this.guardarEstudiante();
        break;
      case 'Editar':
        this.actualizarEstudiante();
        break;
    }
  }

}
