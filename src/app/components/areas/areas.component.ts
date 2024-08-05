import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AreasService } from './services/areas.service';
import { EncryptService } from 'src/app/shared/services/encrypt.service';
import { Environments } from 'src/app/environments/environments';
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
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})

export class AreasComponent implements OnInit {
  
  action_head_ED: string = 'Crear';
  action_head_AC: string = 'Crear';

  show_AC: boolean = false;
  show_ED: boolean = false;

  action_button_AC: string = 'Guardar';
  action_button_ED: string = 'Guardar';
  _show_spinner: boolean = false;

  modelAreaEducativa: any = [];
  modelAreaAcademica: any = [];
  listaAreaEducativa: any = [];
  listaAreaAcademica: any = [];

  listaAreaUnida: any = [];
  selectedArea: any;

  public areasEdForm = new FormGroup ({
    nombreArea:  new FormControl(''),
    descripcion:       new FormControl(''),
    campoA:            new FormControl()
  });

  public areasAcForm = new FormGroup ({
    idAreaEducativa:  new FormControl(),
    nombreArea:  new FormControl(''),
    descripcion:       new FormControl(''),
    campoA:            new FormControl()
  });

  constructor( private area: AreasService, private ncrypt: EncryptService,private env: Environments ) {}

  ngOnInit(): void { 
    this.unirAreas();
  }

  guardarAreaEducativa() {
    this._show_spinner = true;
    let x: any = sessionStorage.getItem('c_c_r_u')
    this.modelAreaEducativa = {
      nombreArea:  this.areasEdForm.controls['nombreArea'].value,
      descripcion: this.areasEdForm.controls['descripcion'].value,
      fecrea: new Date(),
      usercrea: this.ncrypt.decryptWithAsciiSeed(x, this.env.seed, this.env.hashlvl)
    }

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

  ActualizarAreaEducativa() {
    this._show_spinner = true;
    let x: any = sessionStorage.getItem('c_c_r_u')
    this.modelAreaEducativa = {
      id:          this.idEdcutaiva,
      nombreArea:  this.areasEdForm.controls['nombreArea'].value,
      descripcion: this.areasEdForm.controls['descripcion'].value,
      fecrea: new Date(),
      usercrea: this.ncrypt.decryptWithAsciiSeed(x, this.env.seed, this.env.hashlvl)
    }

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

  idEdcutaiva: any;
  catchDataED(data:any) {
    this.idEdcutaiva = data.id;
    this.areasEdForm.controls['nombreArea'].setValue(data.nombreArea);
    this.areasEdForm.controls['descripcion'].setValue(data.descripcion);
    this.action_button_ED = 'Actualizar';
    this.show_ED = true;
    this.action_head_ED = 'Actualizar';
    // this.show_AC = false;
  }

  idAcademica: any;
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
    this._show_spinner = true;
    let x: any = sessionStorage.getItem('c_c_r_u')
    this.modelAreaAcademica = {
      idAreaEducativa:  this.areasAcForm.controls['idAreaEducativa'].value,
      nombreArea:       this.areasAcForm.controls['nombreArea'].value,
      descripcion:      this.areasAcForm.controls['descripcion'].value,
      fecrea: new Date(),
      usercrea: this.ncrypt.decryptWithAsciiSeed(x, this.env.seed, this.env.hashlvl)
    }

    this.area.guardarAreaAcademica(this.modelAreaAcademica).subscribe({
      next: (x) => {
        Toast.fire({
          icon: 'success',
          title: 'Area academica guardada'
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

  actualizarAreaAcademica() {
    this._show_spinner = true;
    let x: any = sessionStorage.getItem('c_c_r_u')
    this.modelAreaAcademica = {
      id:               this.idAcademica,
      idAreaEducativa:  this.areasAcForm.controls['idAreaEducativa'].value,
      nombreArea:       this.areasAcForm.controls['nombreArea'].value,
      descripcion:      this.areasAcForm.controls['descripcion'].value,
      fecrea: new Date(),
      usercrea: this.ncrypt.decryptWithAsciiSeed(x, this.env.seed, this.env.hashlvl)
    }

    this.area.ActualizarAreaAcademica(this.idAcademica, this.modelAreaAcademica).subscribe({
      next: (x) => {
        Toast.fire({
          icon: 'success',
          title: 'Area academica actualizada'
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

  unirAreas() {
    this._show_spinner = true;
    this.obtenerAreaEducativa();
    this.obtenerAreaAcademica();
    setTimeout(() => {
      if (this.listaAreaEducativa && this.listaAreaAcademica) {
        this.listaAreaUnida = this.listaAreaEducativa.map((areaEducativa:any) => {
          return {
            ...areaEducativa,
            areasAcademicas: this.listaAreaAcademica.filter((areaAcademica:any) => areaAcademica.idAreaEducativa === areaEducativa.id)
          };
        });
        console.log('Lista Unida');
        console.log(this.listaAreaUnida);
      }  
      this._show_spinner = false;
    }, 1500);
    
  }

  obtenerAreaEducativa() {
    this._show_spinner = true;
    let x: any = sessionStorage.getItem('c_c_r_u')
    this.area.obtenerAreas(this.ncrypt.decryptWithAsciiSeed(x, this.env.seed, this.env.hashlvl), 'educativo').subscribe({
      next: (x) => {
        this.listaAreaEducativa = x;
        console.log('Areas educativas')
        console.log(this.listaAreaEducativa)
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }
    })
  }

  obtenerAreaAcademica() {

    console.log('Obteniendo area academica');

    this._show_spinner = true;
    let x: any = sessionStorage.getItem('c_c_r_u')
    this.area.obtenerAreas(this.ncrypt.decryptWithAsciiSeed(x, this.env.seed, this.env.hashlvl), 'academico').subscribe({
      next: (x) => {
        this.listaAreaAcademica = x;
        console.log('Areas academicas')
        console.log(this.listaAreaAcademica)
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }
    })
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

 
}
