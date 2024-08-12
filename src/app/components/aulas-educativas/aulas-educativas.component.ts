import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Environments } from 'src/app/environments/environments';
import { EncryptService } from 'src/app/shared/services/encrypt.service';
import Swal from 'sweetalert2'
import { AulasEducativasService } from './services/aulas-educativas.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ProfesoresService } from '../profesores/services/profesores.service';
import { AreasService } from '../areas/services/areas.service';

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
  selector: 'app-aulas-educativas',
  templateUrl: './aulas-educativas.component.html',
  styleUrls: ['./aulas-educativas.component.scss']
})
export class AulasEducativasComponent implements OnInit {
  action_head_asign:         string = 'Crear';
  _show_spinner:             boolean = false;
  action_head:               string = 'Crear';
  action_button_aulas:       string = 'Crear';
  action_button_asignacion:  string = 'Crear';
  modelAulasEducativas:      any = [];
  listaAulasEducativas:      any = [];
  listaAulasEducativasGhost: any = [];
  showFormCreateAsignacion:  boolean = false;
  modelAsignacionAcademicoAulasProfesor: any = [];
  listaFrecuencias: any = [];
  listaProfesores: any = [];
  listaAreaAcademica: any = [];
  usercrea: any;
  showFormCreate: boolean = false;
  filterAulasEAsignacionAcademicoAulasProf: any;
  IDAsignacionAcademicoAulasProfesor: any;

  idAulasEducativas: number = 0;
  listaAsignacionAcademicoAulasProfesor: any = [];
  listaAsignacionAcademicoAulasProfesorGhost: any = [];
  filterAulasEd: any;
  
  public aulasEducativasForm = new FormGroup ({
    nombre:            new FormControl(''),
    descripcion:       new FormControl(''),
    cantidadAlumnos:   new FormControl(''),
    jornada:           new FormControl(''),
  });

  public asignacionAcademicaAulasProfesorForm = new FormGroup ({
    idAulaEducativa:  new FormControl(''),
    idProfesor:       new FormControl(''),
    idMateria:        new FormControl(''),
    observacion:      new FormControl('')
  });

  public filterForm = new FormGroup({
      filterAulas:   new FormControl('')
    }
  )

  public filterFormAsignacion = new FormGroup({
      filterAsign:   new FormControl('')
    }
  )
  
  ngOnInit(): void {
    let x: any = sessionStorage.getItem('c_c_r_u');
    this.usercrea = this.ncrypt.decryptWithAsciiSeed(x, this.env.seed, this.env.hashlvl);
    this.getDataMaster('JO01');
    this.ObtenerAulasEducativas();
    this.obtenerProfesores();
    this.obtenerAreaAcademica();
    this.obtenerAsignacionAcademicoAulasProfesor();
  }

  constructor( private sharedservs: SharedService, 
               private env: Environments,
               private ncrypt: EncryptService,
               private aulas: AulasEducativasService,
               private profesor: ProfesoresService,
               private area: AreasService, ) {}

  guardarAulasEducativas() {
    this.modelAulasEducativas = {
      nombre:          this.aulasEducativasForm.controls['nombre'].value,
      descripcion:     this.aulasEducativasForm.controls['descripcion'].value,
      jornada:         this.aulasEducativasForm.controls['jornada'].value,
      cantidadAlumnos: this.aulasEducativasForm.controls['cantidadAlumnos'].value,
      fecrea:          new Date(),
      usercrea:        this.usercrea,
      estado: 1,
      permisos: 1
    }

    if      ( this.aulasEducativasForm.controls['nombre'].value == undefined || this.aulasEducativasForm.controls['nombre'].value == null || this.aulasEducativasForm.controls['nombre'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del aula educativa vacía.'} )
    else if ( this.aulasEducativasForm.controls['cantidadAlumnos'].value == undefined || this.aulasEducativasForm.controls['cantidadAlumnos'].value == null || this.aulasEducativasForm.controls['cantidadAlumnos'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la cantidad de alumnos vacío.'} )
    else if ( this.aulasEducativasForm.controls['jornada'].value == undefined || this.aulasEducativasForm.controls['jornada'].value == null || this.aulasEducativasForm.controls['jornada'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la jornada vacía.'} )
    else {
      this._show_spinner = true;
      console.warn(this.modelAulasEducativas)

      this.aulas.guardarAulasEducativas(this.modelAulasEducativas).subscribe({
        next: (x) => {
          Toast.fire({
            icon: 'success',
            title: 'Aula generada correctamente'
          })
          this._show_spinner = false;
        }, error: (e) => {
          Toast.fire({
            icon: 'error',
            title: 'Algo ha pasado!'
          })
          this._show_spinner = false;
          console.error(e);
        }, complete: () => {
          this.ObtenerAulasEducativas();
          this.limpiar();
        }
      })
    }
  }

  actualizarAulasEduactivas() {

    this.modelAulasEducativas = {
      id:              this.idAulasEducativas,
      nombre:          this.aulasEducativasForm.controls['nombre'].value,
      descripcion:     this.aulasEducativasForm.controls['descripcion'].value,
      jornada:         this.aulasEducativasForm.controls['jornada'].value,
      cantidadAlumnos: this.aulasEducativasForm.controls['cantidadAlumnos'].value,
      fecrea:          new Date(),
      usercrea:        this.usercrea,
      estado:          1,
      permisos:        1
    }

    if ( this.aulasEducativasForm.controls['nombre'].value == undefined || this.aulasEducativasForm.controls['nombre'].value == null || this.aulasEducativasForm.controls['nombre'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del aula educativa vacía.'} )
    else if ( this.aulasEducativasForm.controls['cantidadAlumnos'].value == undefined || this.aulasEducativasForm.controls['cantidadAlumnos'].value == null || this.aulasEducativasForm.controls['cantidadAlumnos'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la cantidad de alumnos vacío.'} )
    else if ( this.aulasEducativasForm.controls['jornada'].value == undefined || this.aulasEducativasForm.controls['jornada'].value == null || this.aulasEducativasForm.controls['jornada'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la jornada vacía.'} )
    else {
      this._show_spinner = true;
      console.warn(this.modelAulasEducativas)

      this.aulas.actualizarAulasEduactivas(this.idAulasEducativas, this.modelAulasEducativas).subscribe({
        next: (x) => {
          Toast.fire({
            icon: 'success',
            title: 'Aula generada correctamente'
          })
          this._show_spinner = false;
        }, error: (e) => {
          Toast.fire({
            icon: 'error',
            title: 'Algo ha pasado!'
          })
          this._show_spinner = false;
          console.error(e);
        }, complete: () => {
          this.ObtenerAulasEducativas();
          this.limpiar();
        }

      })
    }
  }

  ObtenerAulasEducativas() {
    this._show_spinner = true;
    this.aulas.obtenerAulasEducativas(this.usercrea).subscribe({
      next:(x) => {
        this.listaAulasEducativas      = x;
        this.listaAulasEducativasGhost = x;
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }
    })
  }

  obtenerProfesores() {
    this._show_spinner = true;
    this.profesor.obtenerProfesores(this.usercrea).subscribe({
      next: (x) => {
        this.listaProfesores = x;
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }
    })
  }

  obtenerAreaAcademica() {
    this._show_spinner = true;
    this.area.obtenerAreas(this.usercrea, 'academico').subscribe({
      next: (x) => {
        this.listaAreaAcademica = x;
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }
    })
  }

  getDataMaster(cod:string) {
    this.sharedservs.getDataMaster(cod).subscribe({
      next: (data) => {
        switch(cod) {
        case 'JO01':
          this.listaFrecuencias = data;
          // console.log(this.listaFrecuencias);
          break;
        }
      }
    })
  } 

  submitMaterias() {

    switch(this.action_button_aulas) {
      case 'Crear':
        this.guardarAulasEducativas();
        break;
      case 'Actualizar':
        this.actualizarAulasEduactivas();
        break;
    }

  }

  eliminarAulasEducativas(id:any, i:number) {
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
        this.aulas.eliminarAulasEducativas( id ).subscribe({
          next: (x) => {
            Swal.fire({
              title: "Eliminado!",
              text:  "Al asignaci ha sido eliminado.",
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
            this.listaAulasEducativas.splice( i, 1 );
          }
        })
      }
    });
  }

  limpiar() {
    this.aulasEducativasForm.controls['nombre'].setValue('');
    this.aulasEducativasForm.controls['descripcion'].setValue('');
    this.aulasEducativasForm.controls['jornada'].setValue('');
    this.aulasEducativasForm.controls['cantidadAlumnos'].setValue(null);
    this.action_button_aulas = 'Crear';
    this.action_head = 'Crear';
    this.showFormCreate = false;
  }

  catchDataAulas (data:any) {
    console.warn(data)
    let jornada: any = data.jornada;
    this.idAulasEducativas = data.id;
    this.aulasEducativasForm.controls['nombre'].setValue(data.nombre);
    this.aulasEducativasForm.controls['descripcion'].setValue(data.descripcion);
    this.aulasEducativasForm.controls['jornada'].setValue(jornada.toString().trim());
    this.aulasEducativasForm.controls['cantidadAlumnos'].setValue(data.cantidadAlumnos);
    this.action_button_aulas = 'Actualizar';
    this.action_head = 'Actualizar';
    this.showFormCreate = true;
  }

  filterAulasEde () {
    this.filterAulasEd = this.filterForm.controls['filterAulas'].value;
    this.listaAulasEducativas = this.listaAulasEducativasGhost.filter((item:any) => 
      item.nombre .toLowerCase() .includes(this.filterAulasEd.toLowerCase()) ||
      item.jornada.toLowerCase() .includes(this.filterAulasEd.toLowerCase()) 
    );
  }

  submitAsignacionAulasMateProf() {
    switch(this.action_head_asign) {
      case 'Crear':
        this.guardarAsignacionAcademicoAulasProfesor();
        break;
      case 'Actualizar':
        this.actualizarAsignacionAcademicoAulasProfesor();
        break;
    }
  }

  limpiarAsignacion() {
    this.asignacionAcademicaAulasProfesorForm.controls['idAulaEducativa'].setValue(null);
    this.asignacionAcademicaAulasProfesorForm.controls['idProfesor'].setValue(null);
    this.asignacionAcademicaAulasProfesorForm.controls['idMateria'].setValue(null);
    this.asignacionAcademicaAulasProfesorForm.controls['observacion'].setValue('');
    this.action_head_asign        = 'Crear';
    this.action_button_asignacion = 'Crear';
    this.showFormCreateAsignacion = false;
  }

  catchDataAsignacion(data:any) {
    this.IDAsignacionAcademicoAulasProfesor = data.id;
    this.asignacionAcademicaAulasProfesorForm.controls['idAulaEducativa'].setValue(data.idAulaEducativa);
    this.asignacionAcademicaAulasProfesorForm.controls['idProfesor'].setValue(data.idProfesor);
    this.asignacionAcademicaAulasProfesorForm.controls['idMateria'].setValue(data.idMateria); 
    this.asignacionAcademicaAulasProfesorForm.controls['observacion'].setValue(data.observacion);
    this.action_head_asign        = 'Actualizar';
    this.action_button_asignacion = 'Actualizar';
    this.showFormCreateAsignacion = true;
  }

  guardarAsignacionAcademicoAulasProfesor() {
    if ( this.asignacionAcademicaAulasProfesorForm.controls['idAulaEducativa'].value == undefined || this.asignacionAcademicaAulasProfesorForm.controls['idAulaEducativa'].value == null || this.asignacionAcademicaAulasProfesorForm.controls['idAulaEducativa'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el aula educativa vacía.'} )
    else if ( this.asignacionAcademicaAulasProfesorForm.controls['idProfesor'].value == undefined || this.asignacionAcademicaAulasProfesorForm.controls['idProfesor'].value == null || this.asignacionAcademicaAulasProfesorForm.controls['idProfesor'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el profesor vacío.'} )
    else if ( this.asignacionAcademicaAulasProfesorForm.controls['idMateria'].value == undefined || this.asignacionAcademicaAulasProfesorForm.controls['idMateria'].value == null || this.asignacionAcademicaAulasProfesorForm.controls['idMateria'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la materia vacío.'} )
    
    this.modelAsignacionAcademicoAulasProfesor = {
      idAulaEducativa: this.asignacionAcademicaAulasProfesorForm.controls['idAulaEducativa'].value,
      idProfesor:      this.asignacionAcademicaAulasProfesorForm.controls['idProfesor'].value,
      idMateria:       this.asignacionAcademicaAulasProfesorForm.controls['idMateria'].value,
      observacion:     this.asignacionAcademicaAulasProfesorForm.controls['observacion'].value,
      fecrea:          new Date(),
      usercrea:        this.usercrea,
      estado:          1,
      permisos:        1
    }
    
    this._show_spinner = true;
    this.aulas.guardarAsignacionAcademicoAulasProfesor(this.modelAsignacionAcademicoAulasProfesor).subscribe({
      next: (x) => {
        Toast.fire({
          icon: 'success',
          title: 'Asignación generada correctamente'
        })
        this._show_spinner = false;
      },error: (e) => {
        Toast.fire({
          icon: 'error',
          title: 'Oops algo ha pasado!'
        })
        this._show_spinner = false;
      }, complete: () => {
        this.limpiarAsignacion();
        this.obtenerAsignacionAcademicoAulasProfesor();
      }
    })

  }

  actualizarAsignacionAcademicoAulasProfesor() {
    if ( this.asignacionAcademicaAulasProfesorForm.controls['idAulaEducativa'].value == undefined || this.asignacionAcademicaAulasProfesorForm.controls['idAulaEducativa'].value == null || this.asignacionAcademicaAulasProfesorForm.controls['idAulaEducativa'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el aula educativa vacía.'} )
    else if ( this.asignacionAcademicaAulasProfesorForm.controls['idProfesor'].value == undefined || this.asignacionAcademicaAulasProfesorForm.controls['idProfesor'].value == null || this.asignacionAcademicaAulasProfesorForm.controls['idProfesor'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el profesor vacío.'} )
    else if ( this.asignacionAcademicaAulasProfesorForm.controls['idMateria'].value == undefined || this.asignacionAcademicaAulasProfesorForm.controls['idMateria'].value == null || this.asignacionAcademicaAulasProfesorForm.controls['idMateria'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la materia vacío.'} )
    
    this.modelAsignacionAcademicoAulasProfesor = {
      id:              this.IDAsignacionAcademicoAulasProfesor,
      idAulaEducativa: this.asignacionAcademicaAulasProfesorForm.controls['idAulaEducativa'].value,
      idProfesor:      this.asignacionAcademicaAulasProfesorForm.controls['idProfesor'].value,
      idMateria:       this.asignacionAcademicaAulasProfesorForm.controls['idMateria'].value,
      observacion:     this.asignacionAcademicaAulasProfesorForm.controls['observacion'].value,
      fecrea:          new Date(),
      usercrea:        this.usercrea,
      estado:          1,
      permisos:        1
    }
    
    this._show_spinner = true;
    this.aulas.ActualizarAsignacionAcademicoAulasProfesor(this.IDAsignacionAcademicoAulasProfesor, this.modelAsignacionAcademicoAulasProfesor).subscribe({
      next: (x) => {
        Toast.fire({
          icon: 'success',
          title: 'Asignación actualziada correctamente'
        })
        this._show_spinner = false;
      },error: (e) => {
        Toast.fire({
          icon: 'error',
          title: 'Oops algo ha pasado!'
        })
        this._show_spinner = false;
      }, complete: () => {
        this.limpiarAsignacion();
        this.obtenerAsignacionAcademicoAulasProfesor();
      }
    })

  }

  eliminarAsignacionAcademicoAulasProfesor(id:any, i:number) {
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
        this.aulas.EliminarAsignacionAcademicoAulasProfesor( id ).subscribe({
          next: (x) => {
            Swal.fire({
              title: "Eliminado!",
              text:  "La asignación ha sido eliminada.",
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
            this.listaAsignacionAcademicoAulasProfesor.splice( i, 1 );
          }
        })
      }
    });
  }

  obtenerAsignacionAcademicoAulasProfesor() {
    this.aulas.obtenerAsignacionAcademicoAulasProfesor(this.usercrea).subscribe({
      next: (x) => {
        this.listaAsignacionAcademicoAulasProfesor = x;
        this.listaAsignacionAcademicoAulasProfesorGhost = x;
        console.warn(this.listaAsignacionAcademicoAulasProfesor)
      }
    })
  }

  filterAsignacionAcademicoAulasProfesor () {
    this.filterAulasEAsignacionAcademicoAulasProf = this.filterFormAsignacion.controls['filterAsign'].value;
    this.listaAsignacionAcademicoAulasProfesor    = this.listaAsignacionAcademicoAulasProfesorGhost.filter((item:any) => 
      item.nombreAulaEducativa .toLowerCase().includes(this.filterAulasEAsignacionAcademicoAulasProf.toLowerCase()) ||
      item.nombreMateria       .toLowerCase().includes(this.filterAulasEAsignacionAcademicoAulasProf.toLowerCase()) ||
      item.nombreProfesor      .toLowerCase().includes(this.filterAulasEAsignacionAcademicoAulasProf.toLowerCase()) 
    );
  }

}
