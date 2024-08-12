import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ProfesoresService } from './services/profesores.service';
import { EncryptService } from 'src/app/shared/services/encrypt.service';
import { Environments } from 'src/app/environments/environments';
import Swal from 'sweetalert2'
import { InstitucionesService } from '../cursos/instituciones/services/instituciones.service';

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
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.scss']
})
export class ProfesoresComponent implements OnInit {
  show_crear: boolean = false;
  _show_spinner: boolean = false;
  action_button: string = 'Crear';
  listapaises:any = [];

  modelProfesores: any = [];

  listaProfesores: any = [];
  listaProfesoresGhost: any = [];

  public filterForm = new FormGroup({
      filterEstud:   new FormControl('')
  })

  public areasEdForm = new FormGroup ({
    nombre:       new FormControl(''),
    email:        new FormControl(''),
    telefono:     new FormControl(''),
    edad:         new FormControl(),
    observacion:  new FormControl(''),
    cedula:       new FormControl(''),
    codpais:      new FormControl(''),
    codprov:      new FormControl(''),
    codCanton:    new FormControl(''),
    direccion:    new FormControl(''),
    idInstitutos: new FormControl(),
  });

  public curriculumForm = new FormGroup({
    curriculumPdfUrl: new FormControl()
  })

  constructor(private instituto: InstitucionesService, private env: Environments, private ncrypt: EncryptService, private sharedservs: SharedService, private profesor: ProfesoresService) {}
  coduser: any;
  ngOnInit(): void {
    let x: any = sessionStorage.getItem('c_c_r_u')
    this.coduser = this.ncrypt.decryptWithAsciiSeed(x, this.env.seed, this.env.hashlvl);
    this.getDataMaster('P00');
    this.obtenerProfesores();
    this.obtenerIntituto();
  }

  getDataMaster(cod:string) {

    this.sharedservs.getDataMaster(cod).subscribe({
      next: (data) => {
        switch(cod) {
        case 'P00':
          this.listapaises = data;
          console.log(this.listapaises);
          break;
        }
      }
    })
  }

  guardarProfesor() {
  
    this.modelProfesores = {

      nombre:       this.areasEdForm.controls['nombre']     .value,
      email:        this.areasEdForm.controls['email']      .value,
      telefono:     this.areasEdForm.controls['telefono']   .value,
      edad:         this.areasEdForm.controls['edad']       .value,
      usercrea:     this.coduser,
      observacion:  this.areasEdForm.controls['observacion'].value,
      cedula:       this.areasEdForm.controls['cedula']     .value,
      codpais:      this.areasEdForm.controls['codpais']    .value,
      codprov:      this.areasEdForm.controls['codprov']    .value,
      direccion:    this.areasEdForm.controls['direccion']  .value,
      codCanton:    this.areasEdForm.controls['codCanton']  .value,
      idInstitutos: this.areasEdForm.controls['idInstitutos'].value,
      curriculumPdfUrl: null,
      estado:       1,
      permisos:     1

    }

    console.warn(this.modelProfesores);

    if ( this.areasEdForm.controls['nombre'].value == undefined || this.areasEdForm.controls['nombre'].value == null || this.areasEdForm.controls['nombre'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del profesor vacío.'} )
    else if ( this.areasEdForm.controls['email'].value == undefined || this.areasEdForm.controls['email'].value == null || this.areasEdForm.controls['email'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el email del profesor vacío.'} )
    else if ( this.areasEdForm.controls['telefono'].value == undefined || this.areasEdForm.controls['telefono'].value == null || this.areasEdForm.controls['telefono'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el telefono del profesor vacío.'} )
    else if ( this.areasEdForm.controls['cedula'].value == undefined || this.areasEdForm.controls['cedula'].value == null || this.areasEdForm.controls['cedula'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la cedula del profesor vacío.'} )
    else if ( this.areasEdForm.controls['codpais'].value == undefined || this.areasEdForm.controls['codpais'].value == null || this.areasEdForm.controls['codpais'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el pais del profesor vacío.'} )
    else if ( this.areasEdForm.controls['codprov'].value == undefined || this.areasEdForm.controls['codprov'].value == null || this.areasEdForm.controls['codprov'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la provincia o estado de ubicacion del profesor vacío.'} )
    else {
  // alert(1)
      this._show_spinner = true;
      this.profesor.guardarProfesores(this.modelProfesores).subscribe({
        next: (x) => {
          Toast.fire({
            icon: 'success',
            title: 'Profesor generado'
          })
          this._show_spinner = false;
        }, error: (e) => {
          Toast.fire({
            icon: 'error',
            title: 'Algo ha pasado!'
          })
          this._show_spinner = false;
        }, complete: () => {
          this.obtenerProfesores();
          this.limpiar();
        }

      })

    }
  }

  filterProf: any;
  filterProfesor () {
    this.filterProf = this.filterForm.controls['filterEstud'].value;
    this.listaProfesores = this.listaProfesoresGhost.filter((item:any) => 
      item.nombre.toLowerCase() .includes(this.filterProf.toLowerCase()) ||
      item.cedula.toLowerCase()      .includes(this.filterProf.toLowerCase()) ||
      item.codprov.toLowerCase().includes(this.filterProf.toLowerCase()) ||
      item.nombrePais.toLowerCase()           .includes(this.filterProf.toLowerCase()) ||
      item.direccion.toLowerCase()  .includes(this.filterProf.toLowerCase()) ||
      item.email.toLowerCase()  .includes(this.filterProf.toLowerCase())
    );
  }


  actualizarProfesor() {
  
    this.modelProfesores = {
      id: this.idProfesor,
      nombre:       this.areasEdForm.controls['nombre'].value,
      email:        this.areasEdForm.controls['email'].value,
      telefono:     this.areasEdForm.controls['telefono'].value,
      edad:         this.areasEdForm.controls['edad'].value,
      usercrea:     this.coduser,
      observacion:  this.areasEdForm.controls['observacion'].value,
      cedula:       this.areasEdForm.controls['cedula'].value,
      codpais:      this.areasEdForm.controls['codpais'].value,
      codprov:      this.areasEdForm.controls['codprov'].value,
      direccion:    this.areasEdForm.controls['direccion'].value,
      codCanton:    this.areasEdForm.controls['codCanton'].value,
      idInstitutos: this.areasEdForm.controls['idInstitutos'].value,
      fecrea:       new Date(),
      curriculumPdfUrl: null,
      estado:   1,
      permisos: 1

    }

    if      ( this.areasEdForm.controls['nombre'].value   == undefined || 
              this.areasEdForm.controls['nombre'].value   == null || this.areasEdForm.controls['nombre'].value   == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del profesor vacío.'} )
    else if ( this.areasEdForm.controls['email'].value    == undefined || 
              this.areasEdForm.controls['email'].value    == null || this.areasEdForm.controls['email'].value    == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el email del profesor vacío.'} )
    else if ( this.areasEdForm.controls['telefono'].value == undefined || 
              this.areasEdForm.controls['telefono'].value == null || this.areasEdForm.controls['telefono'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el telefono del profesor vacío.'} )
    else if ( this.areasEdForm.controls['cedula'].value   == undefined || 
              this.areasEdForm.controls['cedula'].value   == null || this.areasEdForm.controls['cedula'].value   == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la cedula del profesor vacío.'} )
    else if ( this.areasEdForm.controls['codpais'].value  == undefined || 
              this.areasEdForm.controls['codpais'].value  == null || this.areasEdForm.controls['codpais'].value  == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el pais del profesor vacío.'} )
    else if ( this.areasEdForm.controls['codprov'].value  == undefined || 
              this.areasEdForm.controls['codprov'].value  == null || this.areasEdForm.controls['codprov'].value  == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la provincia o estado de ubicacion del profesor vacío.'} )
    else {
      this._show_spinner = true;
      this.profesor.actualizarProfesores( this.idProfesor, this.modelProfesores ).subscribe({
        next: (x) => {
          Toast.fire({
            icon: 'success',
            title: 'Profesor actualizado'
          })
          this._show_spinner = false;
        }, error: (e) => {
          Toast.fire({
            icon: 'error',
            title: 'Algo ha pasado!'
          })
          this._show_spinner = false;
        }, complete: () => {
          this.obtenerProfesores();
          this.limpiar();
        }

      })

    }
  }

  obtenerProfesores() {
    this._show_spinner = true;
    this.profesor.obtenerProfesores(this.coduser).subscribe({
      next: (x) => {
        this.listaProfesores = x;
        this.listaProfesoresGhost = x;
        console.warn(this.listaProfesores);
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }
    })
  }

  submit() {
    switch(this.action_button) {
      case 'Crear':
        this.guardarProfesor();
        break;
      case 'Actualizar':
        this.actualizarProfesor();
        break;
    } 
  }

  idProfesor: number = 0;
  catchData(data:any) {
    this.idProfesor = data.id;
    this.areasEdForm.controls['nombre'].setValue(data.nombre);
    this.areasEdForm.controls['email'].setValue(data.email);
    this.areasEdForm.controls['telefono'].setValue(data.telefono);
    this.areasEdForm.controls['edad'].setValue(data.edad);
    this.areasEdForm.controls['observacion'].setValue(data.observacion);
    this.areasEdForm.controls['cedula'].setValue(data.cedula);
    this.areasEdForm.controls['codpais'].setValue(data.codpais);
    this.areasEdForm.controls['codprov'].setValue(data.codprov);
    this.areasEdForm.controls['direccion'].setValue(data.direccion);
    this.areasEdForm.controls['codCanton'].setValue(data.codCanton);
    this.areasEdForm.controls['idInstitutos'].setValue(data.idInstitutos);
    this.action_button = 'Actualizar';
  }

  limpiar() {
    this.areasEdForm.controls['nombre'].setValue('');
    this.areasEdForm.controls['email'].setValue('');
    this.areasEdForm.controls['telefono'].setValue('');
    this.areasEdForm.controls['edad'].setValue('');
    this.areasEdForm.controls['observacion'].setValue('');
    this.areasEdForm.controls['cedula'].setValue('');
    this.areasEdForm.controls['codpais'].setValue('');
    this.areasEdForm.controls['codprov'].setValue('');
    this.areasEdForm.controls['direccion'].setValue('');
    this.areasEdForm.controls['codCanton'].setValue('');
    this.areasEdForm.controls['idInstitutos'].setValue(null);
    this.action_button = 'Crear';
    this.show_crear = false;
  }

  eliminarProfesor(id:number, i:number) {
    Swal.fire({
      title: "Estás segur@?",
      text:  "Esta acción es irreversible y puede provocar perdidad de datos!",
      icon:  "warning",
      showCancelButton:   true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor:  "#d33",
      confirmButtonText:  "Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.profesor.eliminarProfesores( id ).subscribe({
          next: (x) => {
            Swal.fire({
              title: "Eliminado!",
              text:  "El profesor ha sido eliminado.",
              icon:  "success"
            });
          }, error: (e) => {
            Swal.fire({
              title: "Oops!",
              text: "Intentalo más tarde.",
              icon: "error"
            });
            console.error(e);
          }, complete: () => {
            this.listaProfesores.splice( i, 1 );
          }
        })
      }
    });

  }

  submitCurriculum() {

  }

  listaDeInstitutos: any = [];
  listaDeInstitutosGhost: any = [];
  obtenerIntituto() {
    this.instituto.obtenerInstitutos( this.coduser ).subscribe({
      next: (x) => {
        this.listaDeInstitutos = x;
        this.listaDeInstitutosGhost = x;
      }, error: (e) => {
        console.error(e);
      }, complete: () => {
        console.log(this.listaDeInstitutos);
      }
    })
  }

}
