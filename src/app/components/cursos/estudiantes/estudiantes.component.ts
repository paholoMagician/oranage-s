import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EstudiantesService } from './services/estudiantes.service';

import Swal from 'sweetalert2'
import { EncryptService } from 'src/app/shared/services/encrypt.service';
import { Environments } from 'src/app/environments/environments';
import { CursosService } from '../instituciones/modal-cursos/services/cursos.service';
import { SharedService } from 'src/app/shared/services/shared.service';
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
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})
export class EstudiantesComponent implements OnInit {

  _show_spinner:      boolean = false;
  action_button:      string  = 'Crear';
  modelEstudiante:    any     = [];
  listaDeCursos:      any     = [];
  listaDeCursosGhost: any     = [];
  listaEstudiantes:   any     = [];
  modelAsignCurso:    any     = [];
  xtoken:any;

  private decrypt: any;

  public estudianteForm = new FormGroup ({
      nombre:       new FormControl(''),
      edad:         new FormControl(1),
      cedula:       new FormControl(''),
      email:        new FormControl(''),
      alias:        new FormControl(''),
      telefono:     new FormControl(''),
      observacion:  new FormControl(''),
      curso:        new FormControl('')
    }
  );

  generos: any = [ {nombre: 'Masculino'}, {nombre: 'Femenino'} ]
  
  constructor( private est:EstudiantesService,
               private ncrypt: EncryptService, private fb: FormBuilder,
               private env: Environments, private shar: SharedService,
               private curso: CursosService ) {}

  ngOnInit(): void {  

    const xuser: any = sessionStorage.getItem('c_c_r_u');
    this.decrypt = this.ncrypt.decryptWithAsciiSeed(xuser, this.env.seed, this.env.hashlvl);
    this.obtenerCursos( this.decrypt, 0 );    
    this.obtenerEstudiantesCreados( this.decrypt, 1 );

    // Deshabilitar los controles excepto 'curso' en ngOnInit
    this.disableFormControls();

    // Suscribirse a los cambios del control 'curso'
    const cursoControl = this.estudianteForm.get('curso');
    if (cursoControl) {
      cursoControl.valueChanges.subscribe(cursoValue => {
        if (cursoValue) {
          // Si 'curso' tiene valor, habilitar los demás controles
          this.enableFormControls();
        } else {
          // Si 'curso' está vacío, deshabilitar los demás controles
          this.disableFormControls();
        }
      });
    }

  }

  disableFormControls() {
    this.getFormControl('nombre').disable();
    this.getFormControl('cedula').disable();
    this.getFormControl('edad').disable();
    this.getFormControl('telefono').disable();
    this.getFormControl('email').disable();
    this.getFormControl('observacion').disable();
  }

  enableFormControls() {
    this.getFormControl('nombre').enable();
    this.getFormControl('cedula').enable();
    this.getFormControl('edad').enable();
    this.getFormControl('telefono').enable();
    this.getFormControl('email').enable();
    this.getFormControl('observacion').enable();
  }

  getFormControl(controlName: string) {
    const control = this.estudianteForm.get(controlName);
    return control ? control : new FormControl();
  }

  obtenerEstudiantesCreados( usercrea:string, tipo:number ) {
    console.log(usercrea);
    this._show_spinner = true;
    this.est.obtenerEstudiantes( usercrea, tipo ).subscribe({
      next: (x) => {
        this.listaEstudiantes = x;
        console.log('ESTUDIANTES !!!!!');
        console.log(this.listaEstudiantes);
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;

      },complete: () => {
        this._show_spinner = false;
      }
    })
  }

  idestudiante:any;
  passestudiante:any;
  codigoEstudiante:any;
  idcurso:any;
  idAsignacionCurso:any;
  catchData(data:any) {
    
    this.idestudiante     = data.idEstudiante;

    this.codigoEstudiante = data.codigoEstudiante;
    this.passestudiante   = data.password;

    this.estudianteForm.controls['nombre']     
                       .setValue(data.nombreEstudiante);
    this.estudianteForm.controls['observacion']
                       .setValue(data.observacion);
    this.estudianteForm.controls['edad']       
                       .setValue(data.edad);
    this.estudianteForm.controls['cedula']     
                       .setValue(data.cedula);
    this.estudianteForm.controls['email']      
                       .setValue(data.emailEstudiante);
    this.estudianteForm.controls['telefono']   
                       .setValue(data.telefonoEstudiante);
    this.obtenerCursos( this.decrypt, 0 );    
    setTimeout(() => {
      this.idcurso = data.idcurso;
      this.idAsignacionCurso = data.idAsignacionCurso;
      this.estudianteForm.controls['curso']     
                       .setValue(this.idcurso);
    }, 1000);

    this.action_button = 'Editar';
    
    
  }

  crearCodigo() {
    const year: any = new Date().getFullYear();
    this.xtoken = this.shar.generateRandomString(15)+'-'+this.decrypt.slice(0,7)+'-'+year.toString();
    console.log(this.xtoken);
    return this.xtoken;
  }

  asignarEstudianteCurso() {

    this.modelAsignCurso = {
      "idestudiante": this.xtoken,
      "idcurso": this.estudianteForm.controls['curso'].value,
      "observacion": "",
      "fecrea": new Date()
    }

    this.est.guardarEstudiantesCurso( this.modelAsignCurso ).subscribe(
      {
        next: (x) => {
          console.warn('Se ha asignado al curso');
        }, error: (e) => {
          console.error(e);
        }, complete: () => {
          this.obtenerCursos( this.decrypt, 0 );   
        }
      }
    )

  }
  
  guardarEstudiante() {

    if ( this.estudianteForm.controls['nombre'].value == undefined || this.estudianteForm.controls['nombre'].value == null || this.estudianteForm.controls['nombre'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del estudiante vacío.'} )
    else if ( this.estudianteForm.controls['cedula'].value == undefined || this.estudianteForm.controls['cedula'].value == null || this.estudianteForm.controls['cedula'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el campo cedula del estudiante vacío.'} )
    else if ( this.estudianteForm.controls['email'].value == undefined || this.estudianteForm.controls['email'].value == null || this.estudianteForm.controls['email'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el campo email del estudiante vacío.'} )
    else if ( this.estudianteForm.controls['telefono'].value == undefined || this.estudianteForm.controls['telefono'].value == null || this.estudianteForm.controls['telefono'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el campo telefono del estudiante vacío.'} )
    else {
      const xuser: any = sessionStorage.getItem('c_c_r_u');
      const decrypt = this.ncrypt.decryptWithAsciiSeed(xuser, this.env.seed, this.env.hashlvl);
      this._show_spinner = true;
      this.modelEstudiante = {
        nombre:      this.estudianteForm.controls['nombre']     .value,
        observacion: this.estudianteForm.controls['observacion'].value,
        edad:        this.estudianteForm.controls['edad']       .value,
        cedula:      this.estudianteForm.controls['cedula']     .value,
        email:       this.estudianteForm.controls['email']      .value,
        telefono:    this.estudianteForm.controls['telefono']   .value,
        fecrea:      new Date(),
        campoA:      '', 
        campoB:      '',
        password:    'OR000',
        usercrea:    decrypt,
        coduser:     this.crearCodigo()
      }

      this.est.guardarEstudiantes( this.modelEstudiante ).subscribe({
        next: (x) => {
          console.log('Guardado');
        }, error: (e) => {
          console.error(e);
          Toast.fire({
            icon: 'error',
            title: 'Algo ha ocurrido'
          })
          this._show_spinner = false;
        }, complete: () => {
          Toast.fire({
            icon: 'success',
            title: 'Estudiante guardado exitosamente'
          })
          this._show_spinner = false;
          this.asignarEstudianteCurso();
          this.limpiar();
        }
      })
    }
  }

  actualizarEstudiante() {
      if ( this.estudianteForm.controls['nombre']       .value == undefined || this.estudianteForm.controls['nombre']  .value == null || this.estudianteForm.controls['nombre']  .value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del estudiante vacío.'} )
      else if ( this.estudianteForm.controls['cedula']  .value == undefined || this.estudianteForm.controls['cedula']  .value == null || this.estudianteForm.controls['cedula']  .value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el campo cedula del estudiante vacío.'} )
      else if ( this.estudianteForm.controls['email']   .value == undefined || this.estudianteForm.controls['email']   .value == null || this.estudianteForm.controls['email']   .value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el campo email del estudiante vacío.'} )
      else if ( this.estudianteForm.controls['telefono'].value == undefined || this.estudianteForm.controls['telefono'].value == null || this.estudianteForm.controls['telefono'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el campo telefono del estudiante vacío.'} )
      else {        
        const xuser: any = sessionStorage.getItem('c_c_r_u');
        const decrypt = this.ncrypt.decryptWithAsciiSeed(xuser, this.env.seed, this.env.hashlvl);
        this._show_spinner = true;

        this.modelEstudiante = {
          "idEstudiante": this.idestudiante,
          "nombre": this.estudianteForm.controls['nombre'].value,
          "observacion": this.estudianteForm.controls['observacion'].value,
          "edad": this.estudianteForm.controls['edad'].value,
          "cedula": this.estudianteForm.controls['cedula'].value,
          "email": this.estudianteForm.controls['email'].value,
          "telefono": this.estudianteForm.controls['telefono'].value,
          "campoA": "",
          "campoB": "",
          "fecrea": new Date(),
          "password": this.passestudiante,
          "usercrea": decrypt,
          "coduser": this.codigoEstudiante
        }
  
        this.est.actualizarEstudiantes( this.idestudiante, this.modelEstudiante ).subscribe({
          next: (x) => { },
          error: (e) => {
            console.error(e);
            Toast.fire({
              icon: 'error',
              title: 'Algo ha ocurrido'
            })
            this._show_spinner = false;
          }, complete: () => {
            Toast.fire({
              icon: 'success',
              title: 'Estudiante actualizado exitosamente'
            })
            this._show_spinner = false;
            this.limpiar();
          }
        })
      }
  }

  guardarEstudianteCursos(model:any) {
    this.est.guardarEstudiantesCurso(model).subscribe({
      next: (x) => {
        console.log(x);
      }
    })
  }

  limpiar() {
    this.estudianteForm.controls['nombre']
        .setValue('');
        
    this.estudianteForm.controls['observacion']
        .setValue('');

    this.estudianteForm.controls['edad']
        .setValue(1);

    this.estudianteForm.controls['cedula']
        .setValue('');

    this.estudianteForm.controls['email']
        .setValue('');

    this.estudianteForm.controls['telefono']
        .setValue('');

    this.action_button = 'Crear';

  }

  cancel() {
    this.estudianteForm.controls['curso']     
                       .setValue('');
  }


  obtenerCursos(data: any, type: number) {
    this.curso.obtenerCursos(data, type).subscribe({
      next: (x) => {
        this.listaDeCursos = x;
        this.listaDeCursosGhost = x;
  
        // Calcular la diferencia en días y agregarla a cada curso
        this.listaDeCursos.forEach((curso: any) => {
          const fechaInicio = new Date(curso.fechainscripIni);
          const fechaFin = new Date(curso.fechainscripFin);
          const diferenciaDias = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));

          const fechaInicioCurso = new Date(curso.fechaini);
          const fechaFinCurso = new Date(curso.fechafin);
          const diferenciaDiasCurso = Math.ceil((fechaFinCurso.getTime() - fechaInicioCurso.getTime()) / (1000 * 60 * 60 * 24));

          curso.diasFaltantes = diferenciaDias;
          curso.diasFaltantesCurso = diferenciaDiasCurso;
        });
  
        console.warn(this.listaDeCursos);
      }, complete: () => {
        this.listaDeCursos.filter((element: any) => {
          if (element.tipo == 1) element.modalidad = 'Online';
          else if (element.tipo == 2) element.modalidad = 'Presencial';
          else if (element.tipo == 3) element.modalidad = 'Semi Presencial';
        })
      }
    })
  }

  
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
