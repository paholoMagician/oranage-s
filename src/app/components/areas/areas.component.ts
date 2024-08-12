import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AreasService } from './services/areas.service';
import { EncryptService } from 'src/app/shared/services/encrypt.service';
import { Environments } from 'src/app/environments/environments';
import Swal from 'sweetalert2'
import { InstitucionesService } from '../cursos/instituciones/services/instituciones.service';
import { firstValueFrom, Observable, tap } from 'rxjs';

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
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})

export class AreasComponent implements OnInit {
  
  action_head_ED: string = 'Crear';
  action_head_AC: string = 'Crear';
  action_head_Mat: string = 'Crear';

  show_AC: boolean = false;
  show_ED: boolean = false;
  show_Mat: boolean = false;
  idMateria: any;

  action_button_AC: string = 'Crear';
  action_button_ED: string = 'Crear';
  action_button_Mat: string = 'Crear';
  _show_spinner: boolean = false;
  modelMaterias: any = [];

  modelAreaEducativa: any = [];
  modelAreaAcademica: any = [];
  listaAreaEducativa: any = [];
  listaAreaAcademica: any = [];
  idEdcutaiva: any;
  idAcademica: any;

  listaDeInstitutos: any = [];
  listaDeInstitutosGhost: any = [];

  listaAreaUnida: any = [];
  selectedArea: any;
  listaMaterias: any = [];
  coduser: any;

  public areasEdForm = new FormGroup ({
    nombreArea:  new FormControl(''),
    descripcion:       new FormControl(''),
    campoA:            new FormControl(),
    idInstitutos:      new FormControl()
  });

  public materiasForm = new FormGroup ({
    nombre:          new FormControl(''),
    observacion:     new FormControl(''),
    idAreaAcademica: new FormControl(),
  });

  public areasAcForm = new FormGroup ({
    idAreaEducativa:  new FormControl(),
    nombreArea:  new FormControl(''),
    descripcion:       new FormControl(''),
    campoA:            new FormControl()
  });

  constructor( private instituto: InstitucionesService, private area: AreasService, private ncrypt: EncryptService,private env: Environments ) {}

  ngOnInit(): void { 
    let x: any = sessionStorage.getItem('c_c_r_u')
    this.coduser = this.ncrypt.decryptWithAsciiSeed(x, this.env.seed, this.env.hashlvl);
    this.unirAreas();
    this.obtenerIntituto();
  }

  guardarAreaEducativa() {
    
    this.modelAreaEducativa = {
      nombreArea:  this.areasEdForm.controls['nombreArea'].value,
      descripcion: this.areasEdForm.controls['descripcion'].value,
      idInstitutos: this.areasEdForm.controls['idInstitutos'].value,
      fecrea: new Date(),
      usercrea: this.coduser
    }
    if      (this.areasEdForm.controls['nombreArea'].value   == undefined 
      || this.areasEdForm.controls['nombreArea'].value == null || this.areasEdForm.controls['nombreArea'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del area educativa vacía.'})
    else if (this.areasEdForm.controls['idInstitutos'].value   == undefined 
      || this.areasEdForm.controls['idInstitutos'].value == null || this.areasEdForm.controls['idInstitutos'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el instituto vacío.'})
    else {
      this._show_spinner = true;
      this.area.guardarAreaEduactiva(this.modelAreaEducativa).subscribe({
        next: (x) => {
          Toast.fire({
            icon: 'success',
            title: 'Area educativa guardada'
          })
          this._show_spinner = false;
        }, error: (e) => {
          console.error(e);
          Toast.fire({
            icon: 'error',
            title: 'Algo ha sucedido!'
          })
          this._show_spinner = false;
        }, complete: () => {
          this.limpiarED();
          this.unirAreas();
        }
      })
    }
  
  }

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

  ActualizarAreaEducativa() {
    
    this.modelAreaEducativa = {
      id:          this.idEdcutaiva,
      nombreArea:  this.areasEdForm.controls['nombreArea'].value,
      descripcion: this.areasEdForm.controls['descripcion'].value,
      idInstitutos: this.areasEdForm.controls['idInstitutos'].value,
      fecrea:      new Date(),
      usercrea:    this.coduser
    }

    if      (this.areasEdForm.controls['nombreArea'].value   == undefined 
      || this.areasEdForm.controls['nombreArea'].value == null || this.areasEdForm.controls['nombreArea'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del area educativa vacía.'})
    else if (this.areasEdForm.controls['idInstitutos'].value   == undefined 
      || this.areasEdForm.controls['idInstitutos'].value == null || this.areasEdForm.controls['idInstitutos'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el instituto vacío.'})
    else {
      this._show_spinner = true;
      this.area.ActualizarAreaEducativa(this.idEdcutaiva, this.modelAreaEducativa).subscribe({
        next: (x) => {
          Toast.fire({
            icon: 'success',
            title: 'Area educativa actualizada'
          })
          this._show_spinner = false;
        }, error: (e) => {
          console.error(e);
          Toast.fire({
            icon: 'error',
            title: 'Algo ha sucedido!'
          })
          this._show_spinner = false;
        }, complete: () => {
          this.limpiarED();
          this.unirAreas();
        }
      }) 
    }
  }

  catchDataED(data:any) {
    this.idEdcutaiva = data.id;
    this.areasEdForm.controls['nombreArea'].setValue(data.nombreArea);
    this.areasEdForm.controls['descripcion'].setValue(data.descripcion);
    this.action_button_ED = 'Actualizar';
    this.show_ED = true;
    this.action_head_ED = 'Actualizar';
    // this.show_AC = false;
  }

  catchDataAC(data:any) {
    this.idAcademica = data.id;
    this.areasAcForm.controls['idAreaEducativa'].setValue(data.idAreaEducativa);
    this.areasAcForm.controls['nombreArea'].setValue(data.nombreArea);
    this.areasAcForm.controls['descripcion'].setValue(data.descripcion);
    this.action_button_AC = 'Actualizar';
    this.show_AC = true;
    this.action_head_AC = 'Actualizar';
    // this.show_ED = false;
  }

  guardarAreaAcademica() {
    this.modelAreaAcademica = {
      idAreaEducativa:  this.areasAcForm.controls['idAreaEducativa'].value,
      nombreArea:       this.areasAcForm.controls['nombreArea'].value,
      descripcion:      this.areasAcForm.controls['descripcion'].value,
      fecrea: new Date(),
      usercrea: this.coduser
    }

    if      (this.areasAcForm.controls['nombreArea'].value   == undefined 
      || this.areasAcForm.controls['nombreArea'].value == null || this.areasAcForm.controls['nombreArea'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del area académica vacía.'})
    else if (this.areasAcForm.controls['idAreaEducativa'].value   == undefined 
      || this.areasAcForm.controls['idAreaEducativa'].value == null || this.areasAcForm.controls['idAreaEducativa'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el área educativa vacío.'})
    else {
      this._show_spinner = true;
      this.area.guardarAreaAcademica(this.modelAreaAcademica).subscribe({
        next: (x) => {
          Toast.fire({
            icon: 'success',
            title: 'Area académica guardada'
          })
        }, error: (e) => {
          console.error(e);
          Toast.fire({
            icon: 'error',
            title: 'Algo ha sucedido!'
          })
          this._show_spinner = false;
        }, complete: () => {
          this.limpiarAC();
          this.unirAreas();
          this._show_spinner = false;
        }
      }) 
    }
  }

  actualizarAreaAcademica() {
    
    this.modelAreaAcademica = {
      id:               this.idAcademica,
      idAreaEducativa:  this.areasAcForm.controls['idAreaEducativa'].value,
      nombreArea:       this.areasAcForm.controls['nombreArea'].value,
      descripcion:      this.areasAcForm.controls['descripcion'].value,
      fecrea: new Date(),
      usercrea: this.coduser
    }

    if      (this.areasAcForm.controls['nombreArea'].value   == undefined 
      || this.areasAcForm.controls['nombreArea'].value == null || this.areasAcForm.controls['nombreArea'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del área académica vacía.'})
    else if (this.areasAcForm.controls['idAreaEducativa'].value   == undefined 
      || this.areasAcForm.controls['idAreaEducativa'].value == null || this.areasAcForm.controls['idAreaEducativa'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el área educativa vacío.'})
    else {
      this._show_spinner = true;
      this.area.ActualizarAreaAcademica(this.idAcademica, this.modelAreaAcademica).subscribe({
        next: (x) => {
          Toast.fire({
            icon: 'success',
            title: 'Area académica actualizada'
          })
        }, error: (e) => {
          console.error(e);
          Toast.fire({
            icon: 'error',
            title: 'Algo ha sucedido!'
          })
          this._show_spinner = false;
        }, complete: () => {
          this.limpiarAC();
          this.unirAreas();
          this._show_spinner = false;
        }
      }) 
    }
  }

  unirAreas() {
    this._show_spinner = true;
  
    // Usar firstValueFrom en lugar de toPromise
    const promesaAreasEducativas: any = firstValueFrom(this.obtenerAreaEducativa());
    const promesaAreasAcademicas: any = firstValueFrom(this.obtenerAreaAcademica());
    const promesaMaterias:any = firstValueFrom(this.obtenerMaterias());
  
    // Usar Promise.all para esperar a que todas las promesas se resuelvan
    Promise.all([promesaAreasEducativas, promesaAreasAcademicas, promesaMaterias])
      .then(([areasEducativas, areasAcademicas, materias]) => {
        if (areasEducativas && areasAcademicas && materias) {
          this.listaAreaUnida = areasEducativas.map((areaEducativa: any) => {
            return {
              ...areaEducativa,
              areasAcademicas: areasAcademicas
                .filter((areaAcademica: any) => areaAcademica.idAreaEducativa === areaEducativa.id)
                .map((areaAcademica: any) => {
                  return {
                    ...areaAcademica,
                    materias: materias.filter((materia: any) => materia.idAreaAcademica === areaAcademica.id)
                  };
                })
            };
          });
          console.log('Lista Unida:', this.listaAreaUnida);
        }
        this._show_spinner = false;
      })
      .catch((error) => {
        console.error('Error al unir las áreas:', error);
        this._show_spinner = false;
      });
  }
  
  obtenerAreaEducativa() {
    let x: any = sessionStorage.getItem('c_c_r_u');
    return this.area.obtenerAreas(this.ncrypt.decryptWithAsciiSeed(x, this.env.seed, this.env.hashlvl), 'educativo')
      .pipe(tap((data) => {
        this.listaAreaEducativa = data;
        console.log('Áreas educativas:', this.listaAreaEducativa);
      }));
  }
  
  obtenerAreaAcademica() {
    return this.area.obtenerAreas(this.coduser, 'academico')
      .pipe(tap((data) => {
        this.listaAreaAcademica = data;
        console.log('Áreas académicas:', this.listaAreaAcademica);
      }));
  }
  
  obtenerMaterias() {
    return this.area.obtenerAreas(this.coduser, 'materia')
      .pipe(tap((data) => {
        this.listaMaterias = data;
        console.log('Materias:', this.listaMaterias);
      }));
  }
  
  EliminarAreaEducativa(id:any) {
    Swal.fire({
      title: "Estás segur@?",
      text:  "Esta acción es irreversible y puede provocar perdidad de datos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText:  "Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this._show_spinner = true;
        this.area.EliminarAreaEducativa(id).subscribe({
          next: (x) => {
            Swal.fire({
              title: "Eliminado",
              text: "Esta area ha sido eliminado",
              icon: "success"
            });
            this._show_spinner = false;
          },
          error: (e) => {
            Swal.fire({
              title: "Oops!",
              text: "Algo ha ocurrido!",
              icon: "error"
            });
            this._show_spinner = false;
          }, complete: () => {
            this.unirAreas()
          }
        })
      }
    });
  }

  EliminarAreaAcademica(id:any, index:number) {

    console.warn("data area academica");
    console.warn(id);

    Swal.fire({
      title: "Estás segur@?",
      text:  "Esta acción es irreversible y puede provocar perdidad de datos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText:  "Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this._show_spinner = true;
        this.area.EliminarAreaAcademica(id).subscribe({
          next: (x) => {
            Swal.fire({
              title: "Eliminado",
              text: "Esta area ha sido eliminado",
              icon: "success"
            });
            this._show_spinner = false;
          }, error: (e) => {
            Swal.fire({
              title: "Oops!",
              text: "Algo ha ocurrido!",
              icon: "error"
            });
            this._show_spinner = false;
          }, complete: () => {
            console.warn('LLEGANDO')
            this.unirAreas()
          }
        })        
      }
    });
  }

  eliminarAreaAcademicaLista(index:number) {
    this.listaAreaAcademica.splice(index, 1)
  }

  submitED() {
    
    switch( this.action_button_ED ) {
      case 'Guardar':
        this.guardarAreaEducativa();
        break;
      case 'Actualizar':
        this.ActualizarAreaEducativa();
        break
    }
  }

  submitAC() {
    console.warn(this.action_head_AC);
    switch( this.action_head_AC ) {
      case 'Crear':
        this.guardarAreaAcademica();
        break;
      case 'Actualizar':
        this.actualizarAreaAcademica();
        break;
    }
  }

  limpiarAC() {    
    this.areasAcForm.controls['idAreaEducativa'].setValue(null);
    this.areasAcForm.controls['nombreArea'].setValue('');
    this.areasAcForm.controls['descripcion'].setValue('');
    this.action_button_AC = 'Guardar';
    this.show_AC = false;
    this.action_head_AC = 'Crear';
  }

  limpiarED() {
    this.areasEdForm.controls['nombreArea'].setValue('');
    this.areasEdForm.controls['descripcion'].setValue('');
    this.action_button_ED = 'Guardar';
    this.show_ED = false;
    this.action_head_ED = 'Crear';
  }

  guardarMaterias() {
    
    this.modelMaterias = {
      nombre:          this.materiasForm.controls['nombre'].value,
      observacion:     this.materiasForm.controls['observacion'].value,
      idAreaAcademica: this.materiasForm.controls['idAreaAcademica'].value,
      fecrea:      new Date(),
      usercrea:    this.coduser,
      estado:      1,
      permiso:     1 
    }

    if ( this.materiasForm.controls['nombre'].value == undefined || this.materiasForm.controls['nombre'].value == null || this.materiasForm.controls['nombre'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre de la materia vacía.'} )
    else if ( this.materiasForm.controls['idAreaAcademica'].value == undefined || this.materiasForm.controls['idAreaAcademica'].value == null || this.materiasForm.controls['idAreaAcademica'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la area academica vacía.'} )
    else {
      this._show_spinner = true;
      this.area.guardarMaterias(this.modelMaterias).subscribe({
        next: (x) => {
          Toast.fire({
            icon: 'success',
            title: 'Materia generada'
          })
          this._show_spinner = false;
        }, error: (e) => {
          Toast.fire({
            icon: 'error',
            title: 'Oops algo ha ocurrido!'
          })
          this._show_spinner = false;
          console.error(e);
        }, complete: () => {
          this.limpiarMat();
          this.unirAreas();
        }
      })
    }
    
  }
  
  actualizarMaterias() {
    this._show_spinner = true;
    this.modelMaterias = {
      id:              this.idMateria,
      nombre:          this.materiasForm.controls['nombre'].value,
      observacion:     this.materiasForm.controls['observacion'].value,
      idAreaAcademica: this.materiasForm.controls['idAreaAcademica'].value,
      fecrea:      new Date(),
      usercrea:    this.coduser,
      estado:      1,
      permiso:     1 
    }

    if ( this.materiasForm.controls['nombre'].value == undefined || this.materiasForm.controls['nombre'].value == null || this.materiasForm.controls['nombre'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre de la materia vacía.'} )
    else if ( this.materiasForm.controls['idAreaAcademica'].value == undefined || this.materiasForm.controls['idAreaAcademica'].value == null || this.materiasForm.controls['idAreaAcademica'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la area academica vacía.'} )
    else {
      this.area.ActualizarMateria(this.idMateria, this.modelMaterias).subscribe({
        next: (x) => {
          Toast.fire({
            icon: 'success',
            title: 'Materia actualizada'
          })
          this._show_spinner = false;
        }, error: (e) => {
          Toast.fire({
            icon: 'error',
            title: 'Oops algo ha ocurrido!'
          })
          this._show_spinner = false;
          console.error(e);
        },complete: () => {
          this.limpiarMat();
          this.unirAreas();
        }
      })
    }    
  }

  catchDataMat(data:any) {
    this.idMateria = data.id;
    this.materiasForm.controls['nombre'].setValue(data.nombre);
    this.materiasForm.controls['observacion'].setValue(data.observacion);
    this.materiasForm.controls['idAreaAcademica'].setValue(data.idAreaAcademica);
    this.action_head_Mat = 'Actualizar';
    this.show_Mat = true;
    this.action_button_Mat = 'Actualizar';
  }

  submitMat() {
    switch(this.action_button_Mat) {
      case 'Crear':
        this.guardarMaterias();
        break;
      case 'Actualizar':
        this.actualizarMaterias();
        break;
    }
  }

  limpiarMat() {
    this.materiasForm.controls['nombre']         .setValue('');
    this.materiasForm.controls['observacion']    .setValue('');
    this.materiasForm.controls['idAreaAcademica'].setValue(null);
    this.action_head_Mat = 'Crear';
    this.show_Mat = false;
    this.action_button_Mat = 'Crear';
  }
 
  eliminarMateria(id:number, j:number) {
    Swal.fire({
      title: "Estás segur@?",
      text:  "Esta acción es irreversible y puede provocar perdidad de datos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText:  "Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this._show_spinner = true;
        this.area.EliminarMaterias(id).subscribe({
          next: (x) => {
            Swal.fire({
              title: "Eliminado",
              text: "Esta materia ha sido eliminado",
              icon: "success"
            });
            this._show_spinner = false;
          },
          error: (e) => {
            Swal.fire({
              title: "Oops!",
              text: "Algo ha ocurrido!",
              icon: "error"
            });
            this._show_spinner = false;
          }, complete: () => {
            this.unirAreas()
          }
        })
      }
    });
  }

}
