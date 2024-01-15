import { Component, Inject, OnInit } from '@angular/core';
import { StorageService } from 'src/app/components/services/mediafilesservices/storage.service';
import { InstitucionesComponent } from '../instituciones.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Environments } from 'src/app/environments/environments';
import { FormControl, FormGroup } from '@angular/forms';
import { CursosService } from './services/cursos.service';

import Swal from 'sweetalert2'
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

@Component({
  selector: 'app-modal-cursos',
  templateUrl: './modal-cursos.component.html',
  styleUrls: ['./modal-cursos.component.scss']
})

export class ModalCursosComponent implements OnInit {

  action_button: string = 'Crear';
  _show_spinner: boolean = false;
  nombreInstitucion: string= '';
  dataProvider: any;

  public cursosForm = new FormGroup ({
      nombre: new FormControl(''),
      desccripcion: new FormControl(''),
      capacidad:  new FormControl(0),
      horaini:  new FormControl(),
      horafin:  new FormControl(),
      fechaini: new FormControl(),
      fechafin: new FormControl(),
      valor:  new FormControl(0),
      campo1: new FormControl(),
      campo2: new FormControl(0), 
      fechainscripIni: new FormControl(), 
      fechainscripFin: new FormControl(),
      observacion: new FormControl(),
      tipo: new FormControl('1')
    });

  constructor(private storageService: StorageService, 
              private curso: CursosService,
              public dialogRef: MatDialogRef<InstitucionesComponent>,
              private env: Environments,
              @Inject(MAT_DIALOG_DATA) public data: any
              ) {}

  ngOnInit(): void {
    this.dataProvider = this.data[0].data;
    console.log(this.data[1].tipo);
    console.warn(this.dataProvider);
    if( this.data[1].tipo = 1 ) {
      this.idCurso =  this.dataProvider.id
      this.catchData();
      this.action_button = 'Editar';
    }

    if( this.data[1].tipo = 0 ) { 
      this.action_button = 'Crear';
    }

      this.nombreInstitucion = this.dataProvider.nombreInstitucion;
  }

  submit() {
    switch(this.action_button) {
      case 'Crear':
        this.guardarCursos();
        break;
      case 'Editar':
        this.actualizarCursos();
        break;
    }
  }

  modelCursos: any = [];
  guardarCursos() {

    // if( this.data[1].tipo == 0 ) {

      console.log('guardando')

      if      (this.cursosForm.controls['nombre'].value   == undefined || this.cursosForm.controls['nombre'].value == null || this.cursosForm.controls['nombre'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del curso vacío.'})
      else if (this.cursosForm.controls['capacidad'].value   == undefined || this.cursosForm.controls['capacidad'].value == null || this.cursosForm.controls['capacidad'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del curso vacío.'})
      else if (this.cursosForm.controls['horaini'].value   == undefined || this.cursosForm.controls['horaini'].value == null || this.cursosForm.controls['horaini'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar la hora inicial vacía.'})
      else if (this.cursosForm.controls['horafin'].value   == undefined || this.cursosForm.controls['horafin'].value == null || this.cursosForm.controls['horafin'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar la hora final vacía.'})
      else if (this.cursosForm.controls['fechaini'].value   == undefined || this.cursosForm.controls['fechaini'].value == null || this.cursosForm.controls['fechaini'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar la fecha inicial vacía.'})
      else if (this.cursosForm.controls['fechafin'].value   == undefined || this.cursosForm.controls['fechafin'].value == null || this.cursosForm.controls['fechafin'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar la fecha final vacía.'})
      else {

        this.modelCursos = {
          idInstitutos:    this.dataProvider.idintituto,
          nombre:          this.cursosForm.controls['nombre'].value,
          desccripcion:    this.cursosForm.controls['desccripcion'].value,
          capacidad:       this.cursosForm.controls['capacidad'].value,
          horaini:         this.cursosForm.controls['horaini'].value,
          horafin:         this.cursosForm.controls['horafin'].value,
          fechaini:        this.cursosForm.controls['fechaini'].value,
          fechafin:        this.cursosForm.controls['fechafin'].value,
          valor:           this.cursosForm.controls['valor'].value,
          campo1:          this.cursosForm.controls['campo1'].value,
          campo2:          this.cursosForm.controls['campo2'].value,
          estado:          1,
          fechainscripIni: this.cursosForm.controls['fechainscripIni'].value,
          fechainscripFin: this.cursosForm.controls['fechainscripFin'].value,
          tipo:            this.cursosForm.controls['tipo'].value,
          observacion:     this.cursosForm.controls['observacion'].value
        }  

        console.log('********************************************');
        console.table(this.modelCursos);
        console.log('********************************************');

        this.curso.guardarCursos(this.modelCursos).subscribe({
          next: (x) => {
            Toast.fire({
              icon: 'success',
              title: 'Curso creado exitosamente'
            })
          }, error: (e) => {
            Toast.fire({
              icon: 'error',
              title: 'Algo ha ocurrido',
              footer: '#C-001'
            })
            console.error(e);
          }, complete: () => {
            this.closeDialog(this.modelCursos);
          }
        })
      // }
    }
  }

  closeDialog(dataexport:any) {
    this.dialogRef.close(dataexport);
  }

  idCurso: number = 0;
  catchData() {

    console.log('Entro a editar ')

    let fa = this.dataProvider.fechaini       .toString().split('T')
    let fb = this.dataProvider.fechafin       .toString().split('T')
    let fc = this.dataProvider.fechainscripIni.toString().split('T')
    let fd = this.dataProvider.fechainscripFin.toString().split('T')

    let xh = this.dataProvider.horaini.trim();
    let xy = this.dataProvider.horafin.trim();
    // this.idCurso = this.dataProvider.id;

    console.warn(this.dataProvider);
    console.warn(this.dataProvider.nombre);
    // console.warn(this.idCurso);

    this.cursosForm.controls['nombre'].setValue(this.dataProvider.nombre);
    this.cursosForm.controls['desccripcion'].setValue(this.dataProvider.desccripcion);
    this.cursosForm.controls['capacidad'].setValue(this.dataProvider.capacidad);

    // Formatear horas agregando ceros a la izquierda si es necesario
    const formatTime = (time: number): string => {
      return time < 10 ? `0${time}` : `${time}`;
    };
    
    // Asignar horas formateadas a los controles del formulario
    this.cursosForm.controls['horaini'].setValue(`${formatTime(xh)}`);
    this.cursosForm.controls['horafin'].setValue(`${formatTime(xy)}`);

    this.cursosForm.controls['fechaini'].setValue(fa[0]);
    this.cursosForm.controls['fechafin'].setValue(fb[0]);
    this.cursosForm.controls['valor'].setValue(this.dataProvider.valor);
    this.cursosForm.controls['campo1'].setValue(this.dataProvider.campo1);
    this.cursosForm.controls['campo2'].setValue(this.dataProvider.campo2);

    this.cursosForm.controls['fechainscripIni'].setValue(fc[0]);
    this.cursosForm.controls['fechainscripFin'].setValue(fd[0]);
    this.cursosForm.controls['tipo'].setValue(this.dataProvider.tipo.toString());
    this.cursosForm.controls['observacion'].setValue(this.dataProvider.observacion);

  }

  actualizarCursos() {
    if      (this.cursosForm.controls['nombre'].value   == undefined || this.cursosForm.controls['nombre'].value == null || this.cursosForm.controls['nombre'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del curso vacío.'})
      else if (this.cursosForm.controls['capacidad'].value   == undefined || this.cursosForm.controls['capacidad'].value == null || this.cursosForm.controls['capacidad'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del curso vacío.'})
      else if (this.cursosForm.controls['horaini'].value   == undefined || this.cursosForm.controls['horaini'].value == null || this.cursosForm.controls['horaini'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar la hora inicial vacía.'})
      else if (this.cursosForm.controls['horafin'].value   == undefined || this.cursosForm.controls['horafin'].value == null || this.cursosForm.controls['horafin'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar la hora final vacía.'})
      else if (this.cursosForm.controls['fechaini'].value   == undefined || this.cursosForm.controls['fechaini'].value == null || this.cursosForm.controls['fechaini'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar la fecha inicial vacía.'})
      else if (this.cursosForm.controls['fechafin'].value   == undefined || this.cursosForm.controls['fechafin'].value == null || this.cursosForm.controls['fechafin'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar la fecha final vacía.'})
      else {

        this.modelCursos = {
          id:              this.idCurso,
          idInstitutos:    this.dataProvider.idintituto,
          nombre:          this.cursosForm.controls['nombre']      .value,
          desccripcion:    this.cursosForm.controls['desccripcion'].value,
          capacidad:       this.cursosForm.controls['capacidad']   .value,
          horaini:         this.cursosForm.controls['horaini']     .value,
          horafin:         this.cursosForm.controls['horafin']     .value,
          fechaini:        this.cursosForm.controls['fechaini']    .value,
          fechafin:        this.cursosForm.controls['fechafin']    .value,
          valor:           this.cursosForm.controls['valor']       .value,
          campo1:          this.cursosForm.controls['campo1']      .value,
          campo2:          this.cursosForm.controls['campo2']      .value,
          estado:          1,
          fechainscripIni: this.cursosForm.controls['fechainscripIni'].value,
          fechainscripFin: this.cursosForm.controls['fechainscripFin'].value,
          tipo:            this.cursosForm.controls['tipo'].value,
          observacion:     this.cursosForm.controls['observacion'].value
        }  

        this.curso.actualizarCursos(this.idCurso, this.modelCursos).subscribe({
          next: (x) => {
            Toast.fire({
              icon: 'success',
              title: 'Curso creado exitosamente'
            })
          }, error: (e) => {
            Toast.fire({
              icon: 'error',
              title: 'Algo ha ocurrido',
              footer: '#C-001'
            })
            console.error(e);
          }, complete: () => {
            this.closeDialog(this.modelCursos);
          }
        })
      }
    }
  }


