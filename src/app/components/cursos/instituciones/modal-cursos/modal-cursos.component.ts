import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StorageService } from 'src/app/components/services/mediafilesservices/storage.service';
import { InstitucionesComponent } from '../instituciones.component';
import { Environments } from 'src/app/environments/environments';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CursosService } from './services/cursos.service';

import Swal from 'sweetalert2'
import { MatDatepicker } from '@angular/material/datepicker';
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
  idCurso: number = 0;
  @ViewChild('picker', { static: true }) datepicker: MatDatepicker<Date> | undefined; // <-- Inicializamos en la declaración y permitimos que sea 'undefined'
  action_button: string = 'Crear';
  _show_spinner: boolean = false;
  nombreInstitucion: string= '';
  dataProvider: any;
  idInstituto:number = 0;

  cursosFormDatosIdentificativos = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
    nombre: [''],
    desccripcion: [''],
    observacion: ['']
  });

  pagoForm = this._formBuilder.group({
    pago_periodico: [],
    matricula: [],
    valores_terciarios: [],
    observacion_valores: [''],
    periodicidad_pagos: []
  });

    dateForm: FormGroup;
    isLinear = false;

    constructor(private storageService: StorageService, 
                private curso: CursosService,
                public dialogRef: MatDialogRef<InstitucionesComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private env: Environments,
                private _formBuilder: FormBuilder
                ) {
                  this.dateForm = this._formBuilder.group({
                    secondCtrl:           ['', Validators.required],
                    fechaMatriculaInicio: new FormControl<Date | null>(null),
                    fechaMatriculaFin:    new FormControl<Date | null>(null),
                    fechaCursoInicio:     new FormControl<Date | null>(null),
                    fechaCursoFin:        new FormControl<Date | null>(null),
                    horaInicio:           [],
                    horaFinal:            [],
                    asistencia:           [],
                    capacidad:            []
                  });
                }
  
  ngOnInit(): void {
    this.dataProvider = this.data[0].data;
    console.log(this.data[1].tipo)
    if ( this.data[1].tipo == 1 ) this.catchData();
    console.log(this.dataProvider)
    this.nombreInstitucion = this.dataProvider.nombreInstitucion;
    this.idInstituto = this.dataProvider.idintituto
    console.warn(this.idInstituto)
  }

  submit() {
    // if ( this.data[1].tipo == 1 ) this.guardarCursos();
    switch(this.data[1].tipo) {
      case 0:
        this.guardarCursos();
        break;
      case 1:
        this.editaCurso();
    }
  }

  submitDatosIdentificativos() {

  }

  modelCursos: any = [];
  guardarCursos() {

    if      (this.cursosFormDatosIdentificativos.controls['nombre'].value   == undefined || this.cursosFormDatosIdentificativos.controls['nombre'].value == null || this.cursosFormDatosIdentificativos.controls['nombre'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del curso vacío.'})
    else if (this.cursosFormDatosIdentificativos.controls['desccripcion'].value   == undefined || this.cursosFormDatosIdentificativos.controls['desccripcion'].value == null || this.cursosFormDatosIdentificativos.controls['desccripcion'].value == '') Toast.fire({ icon: 'warning', title: 'Describe el curso y su importancia'})
    else if (this.dateForm.controls['fechaCursoInicio'].value   == undefined || this.dateForm.controls['fechaCursoInicio'].value == null || this.dateForm.controls['fechaCursoInicio'].value == '') Toast.fire({ icon: 'warning', title: 'Campo fecha de inicio del curso vacío'})
    else if (this.dateForm.controls['fechaCursoFin'].value   == undefined || this.dateForm.controls['fechaCursoFin'].value == null || this.dateForm.controls['fechaCursoFin'].value == '') Toast.fire({ icon: 'warning', title: 'Campo fecha de fin del curso vacío'})
    else if (this.dateForm.controls['horaInicio'].value   == undefined || this.dateForm.controls['horaInicio'].value == null || this.dateForm.controls['horaInicio'].value == '') Toast.fire({ icon: 'warning', title: 'Campo hora inicio del curso vacío'})
    else if (this.dateForm.controls['horaFinal'].value   == undefined || this.dateForm.controls['horaFinal'].value == null || this.dateForm.controls['horaFinal'].value == '') Toast.fire({ icon: 'warning', title: 'Campo hora final del curso vacío'})
    else {
      this.modelCursos = {
        nombre:             this.cursosFormDatosIdentificativos.controls['nombre']      .value,
        desccripcion:       this.cursosFormDatosIdentificativos.controls['desccripcion'].value,
        capacidad:          this.dateForm.controls['capacidad'].value,
        fechaini:           this.dateForm.controls['fechaCursoInicio'].value,
        fechafin:           this.dateForm.controls['fechaCursoFin'].value,
        campo1: '',
        campo2: 0.0,
        idInstitutos:       this.dataProvider.idintituto,
        estado: 1,
        fechainscripIni:    this.dateForm.controls['fechaMatriculaInicio'].value,
        fechainscripFin:    this.dateForm.controls['fechaMatriculaFin'].value,
        tipo: 1,
        observacion:        this.cursosFormDatosIdentificativos.controls['observacion'].value,
        campo3: 0.0,
        campo4: '',
        asistencia:         this.dateForm.controls['asistencia'].value,
        observacionvalores: this.pagoForm.controls['observacion_valores'].value,
        valormatricula:     this.pagoForm.controls['matricula'].value,
        pagoperiodico:      this.pagoForm.controls['pago_periodico'].value,
        periodicidadpagos:  this.pagoForm.controls['periodicidad_pagos'].value,
        valoresterciarios:  this.pagoForm.controls['valores_terciarios'].value,
        horaInicial:        this.dateForm.controls['horaInicio'].value,
        horaFinal:          this.dateForm.controls['horaFinal'].value
      }

      this.curso.guardarCursos(this.modelCursos).subscribe({
        next: (x) => {

          Toast.fire({
            icon: 'success',
            title: 'Curso creado exitosamente para ' + this.nombreInstitucion.toUpperCase()
          })

        }, error: (e) => {

            Toast.fire({
                icon:   'error',
                title:  'Algo ha ocurrido',
                footer: '#CC-001'
              }
            )

            console.error(e);

        }, complete: () => {        
          this.closeDialog(this.modelCursos);
        }
      })
    }
  }
  
  editaCurso() {

    if      (this.cursosFormDatosIdentificativos.controls['nombre'].value   == undefined || this.cursosFormDatosIdentificativos.controls['nombre'].value == null || this.cursosFormDatosIdentificativos.controls['nombre'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del curso vacío.'})
    else if (this.cursosFormDatosIdentificativos.controls['desccripcion'].value   == undefined || this.cursosFormDatosIdentificativos.controls['desccripcion'].value == null || this.cursosFormDatosIdentificativos.controls['desccripcion'].value == '') Toast.fire({ icon: 'warning', title: 'Describe el curso y su importancia'})
    else if (this.dateForm.controls['fechaCursoInicio'].value   == undefined || this.dateForm.controls['fechaCursoInicio'].value == null || this.dateForm.controls['fechaCursoInicio'].value == '') Toast.fire({ icon: 'warning', title: 'Campo fecha de inicio del curso vacío'})
    else if (this.dateForm.controls['fechaCursoFin'].value   == undefined || this.dateForm.controls['fechaCursoFin'].value == null || this.dateForm.controls['fechaCursoFin'].value == '') Toast.fire({ icon: 'warning', title: 'Campo fecha de fin del curso vacío'})
    else if (this.dateForm.controls['horaInicio'].value   == undefined || this.dateForm.controls['horaInicio'].value == null || this.dateForm.controls['horaInicio'].value == '') Toast.fire({ icon: 'warning', title: 'Campo hora inicio del curso vacío'})
    else if (this.dateForm.controls['horaFinal'].value   == undefined || this.dateForm.controls['horaFinal'].value == null || this.dateForm.controls['horaFinal'].value == '') Toast.fire({ icon: 'warning', title: 'Campo hora final del curso vacío'})
    else {
      this.modelCursos = {
        id:                 this.idCurso,
        nombre:             this.cursosFormDatosIdentificativos.controls['nombre']      .value,
        desccripcion:       this.cursosFormDatosIdentificativos.controls['desccripcion'].value,
        capacidad:          this.dateForm.controls['capacidad']                         .value,
        fechaini:           this.dateForm.controls['fechaCursoInicio']                  .value,
        fechafin:           this.dateForm.controls['fechaCursoFin']                     .value,
        campo1: '',
        campo2: 0.0,
        idInstitutos:       this.dataProvider.idintituto,
        estado: 1,
        fechainscripIni:    this.dateForm.controls['fechaMatriculaInicio'].value,
        fechainscripFin:    this.dateForm.controls['fechaMatriculaFin'].value,
        tipo: 1,
        observacion:        this.cursosFormDatosIdentificativos.controls['observacion'].value,
        campo3: 0.0,
        campo4: '',
        asistencia:         this.dateForm.controls['asistencia'].value,
        observacionvalores: this.pagoForm.controls['observacion_valores'].value,
        valormatricula:     this.pagoForm.controls['matricula'].value,
        pagoperiodico:      this.pagoForm.controls['pago_periodico'].value,
        periodicidadpagos:  this.pagoForm.controls['periodicidad_pagos'].value,
        valoresterciarios:  this.pagoForm.controls['valores_terciarios'].value,
        horaInicial:        this.dateForm.controls['horaInicio'].value,
        horaFinal:          this.dateForm.controls['horaFinal'].value
      }

      // console.warn( this.modelCursos )

      this.curso.actualizarCursos(this.idCurso, this.modelCursos).subscribe({
        next: (x) => {

          Toast.fire({
            icon: 'success',
            title: 'Curso actualizado exitosamente para ' + this.nombreInstitucion.toUpperCase()
          })

        }, error: (e) => {

            Toast.fire({
                icon:   'error',
                title:  'Algo ha ocurrido',
                footer: '#EC-001'
              }
            )

            console.error(e);

        }, complete: () => {        
          this.closeDialog(this.modelCursos);
        }
      })
    }
  }
    
  closeDialog(dataexport:any) {
    this.dialogRef.close(dataexport);
  }    
  
  
  catchData() {

    this.idCurso = this.dataProvider.id;

    let fa = this.dataProvider.fechaini       .toString().split('T')
    let fb = this.dataProvider.fechafin       .toString().split('T')
    let fc = this.dataProvider.fechainscripIni.toString().split('T')
    let fd = this.dataProvider.fechainscripFin.toString().split('T')

    let xh = this.dataProvider.horaInicial.trim();
    let xy = this.dataProvider.horaFinal.trim();

    this.cursosFormDatosIdentificativos.controls['nombre']      .setValue(this.dataProvider.nombre)
    this.cursosFormDatosIdentificativos.controls['desccripcion'].setValue(this.dataProvider.desccripcion)
    this.dateForm.controls['capacidad'].setValue(this.dataProvider.capacidad)
    this.dateForm.controls['fechaCursoInicio'].setValue(fa[0])
    this.dateForm.controls['fechaCursoFin'].setValue(fb[0])
    this.dateForm.controls['fechaMatriculaInicio'].setValue(fc[0])
    this.dateForm.controls['fechaMatriculaFin'].setValue(fd[0])

    // Formatear horas agregando ceros a la izquierda si es necesario
    const formatTime = (time: number): string => {
      return time < 10 ? `0${time}` : `${time}`;
    };

    // // Asignar horas formateadas a los controles del formulario
    this.dateForm.controls['horaInicio'].setValue(`${formatTime(xh)}`);
    this.dateForm.controls['horaFinal'].setValue(`${formatTime(xy)}`);

    this.cursosFormDatosIdentificativos.controls['observacion'].setValue(this.dataProvider.observacion)
    this.dateForm.controls['asistencia'].setValue(this.dataProvider.asistencia)

    this.pagoForm.controls['observacion_valores'].setValue(this.dataProvider.observacionvalores)
    this.pagoForm.controls['matricula'].setValue(this.dataProvider.valormatricula)
    this.pagoForm.controls['pago_periodico'].setValue(this.dataProvider.pagoperiodico)
    this.pagoForm.controls['periodicidad_pagos'].setValue(this.dataProvider.periodicidadpagos)
    this.pagoForm.controls['valores_terciarios'].setValue(this.dataProvider.valoresterciarios)

    this.action_button = 'Editar'

  }

}
  
  
  // catchData() {

    // console.log('Entro a editar ')

    // let fa = this.dataProvider.fechaini       .toString().split('T')
    // let fb = this.dataProvider.fechafin       .toString().split('T')
    // let fc = this.dataProvider.fechainscripIni.toString().split('T')
    // let fd = this.dataProvider.fechainscripFin.toString().split('T')

    // let xh = this.dataProvider.horaini.trim();
    // let xy = this.dataProvider.horafin.trim();
    // // this.idCurso = this.dataProvider.id;

    // console.warn(this.dataProvider);
    // console.warn(this.dataProvider.nombre);
    // // console.warn(this.idCurso);

    // this.cursosForm.controls['nombre'].setValue(this.dataProvider.nombre);
    // this.cursosForm.controls['desccripcion'].setValue(this.dataProvider.desccripcion);
    // this.cursosForm.controls['capacidad'].setValue(this.dataProvider.capacidad);

    // // Formatear horas agregando ceros a la izquierda si es necesario
    // const formatTime = (time: number): string => {
    //   return time < 10 ? `0${time}` : `${time}`;
    // };
    
    // // Asignar horas formateadas a los controles del formulario
    // this.cursosForm.controls['horaini'].setValue(`${formatTime(xh)}`);
    // this.cursosForm.controls['horafin'].setValue(`${formatTime(xy)}`);

    // this.cursosForm.controls['fechaini'].setValue(fa[0]);
    // this.cursosForm.controls['fechafin'].setValue(fb[0]);
    // this.cursosForm.controls['valor'].setValue(this.dataProvider.valor);
    // this.cursosForm.controls['campo1'].setValue(this.dataProvider.campo1);
    // this.cursosForm.controls['campo2'].setValue(this.dataProvider.campo2);

    // this.cursosForm.controls['fechainscripIni'].setValue(fc[0]);
    // this.cursosForm.controls['fechainscripFin'].setValue(fd[0]);
    // this.cursosForm.controls['tipo'].setValue(this.dataProvider.tipo.toString());
    // this.cursosForm.controls['observacion'].setValue(this.dataProvider.observacion);

  // }

  // actualizarCursos() {
    // if      (this.cursosForm.controls['nombre'].value   == undefined || this.cursosForm.controls['nombre'].value == null || this.cursosForm.controls['nombre'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del curso vacío.'})
    //   else if (this.cursosForm.controls['capacidad'].value   == undefined || this.cursosForm.controls['capacidad'].value == null || this.cursosForm.controls['capacidad'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del curso vacío.'})
    //   else if (this.cursosForm.controls['horaini'].value   == undefined || this.cursosForm.controls['horaini'].value == null || this.cursosForm.controls['horaini'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar la hora inicial vacía.'})
    //   else if (this.cursosForm.controls['horafin'].value   == undefined || this.cursosForm.controls['horafin'].value == null || this.cursosForm.controls['horafin'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar la hora final vacía.'})
    //   else if (this.cursosForm.controls['fechaini'].value   == undefined || this.cursosForm.controls['fechaini'].value == null || this.cursosForm.controls['fechaini'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar la fecha inicial vacía.'})
    //   else if (this.cursosForm.controls['fechafin'].value   == undefined || this.cursosForm.controls['fechafin'].value == null || this.cursosForm.controls['fechafin'].value == 0) Toast.fire({ icon: 'warning', title: 'No puedes dejar la fecha final vacía.'})
    //   else {

    //     this.modelCursos = {
    //       id:              this.idCurso,
    //       idInstitutos:    this.dataProvider.idintituto,
    //       nombre:          this.cursosForm.controls['nombre']      .value,
    //       desccripcion:    this.cursosForm.controls['desccripcion'].value,
    //       capacidad:       this.cursosForm.controls['capacidad']   .value,
    //       horaini:         this.cursosForm.controls['horaini']     .value,
    //       horafin:         this.cursosForm.controls['horafin']     .value,
    //       fechaini:        this.cursosForm.controls['fechaini']    .value,
    //       fechafin:        this.cursosForm.controls['fechafin']    .value,
    //       valor:           this.cursosForm.controls['valor']       .value,
    //       campo1:          this.cursosForm.controls['campo1']      .value,
    //       campo2:          this.cursosForm.controls['campo2']      .value,
    //       estado:          1,
    //       fechainscripIni: this.cursosForm.controls['fechainscripIni'].value,
    //       fechainscripFin: this.cursosForm.controls['fechainscripFin'].value,
    //       tipo:            this.cursosForm.controls['tipo'].value,
    //       observacion:     this.cursosForm.controls['observacion'].value
    //     }  

    //     this.curso.actualizarCursos(this.idCurso, this.modelCursos).subscribe({
    //       next: (x) => {
    //         Toast.fire({
    //           icon: 'success',
    //           title: 'Curso creado exitosamente'
    //         })
    //       }, error: (e) => {
    //         Toast.fire({
    //           icon: 'error',
    //           title: 'Algo ha ocurrido',
    //           footer: '#C-001'
    //         })
    //         console.error(e);
    //       }, complete: () => {
    //         this.closeDialog(this.modelCursos);
    //       }
    //     })
    //   }
    // }

  

