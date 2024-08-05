import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Environments } from 'src/app/environments/environments';
import { EncryptService } from 'src/app/shared/services/encrypt.service';
import Swal from 'sweetalert2'
import { AulasEducativasService } from './services/aulas-educativas.service';
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
  selector: 'app-aulas-educativas',
  templateUrl: './aulas-educativas.component.html',
  styleUrls: ['./aulas-educativas.component.scss']
})
export class AulasEducativasComponent implements OnInit {

  _show_spinner: boolean = false;
  action_head:string = 'Crear';
  action_button_aulas: string = 'Crear';
  modelAulasEducativas: any = [];
  listaAulasEducativas: any = []
  listaAulasEducativasGhost: any = []

  public aulasEducativasForm = new FormGroup ({
    nombre:  new FormControl(''),
    descripcion:       new FormControl(''),
    cantidadAlumnos:   new FormControl(''),
    jornada:           new FormControl(''),
  });

  public filterForm = new FormGroup(
    {
      filterAulas:   new FormControl('')
    }
  )

  ngOnInit(): void {
    this.getDataMaster('JO01');
    this.ObtenerAulasEducativas();
  }

  constructor( private sharedservs: SharedService, private env: Environments, private ncrypt: EncryptService, private aulas: AulasEducativasService) {}

  guardarAulasEducativas() {

    let x: any = sessionStorage.getItem('c_c_r_u');
    this.modelAulasEducativas = {
      nombre:          this.aulasEducativasForm.controls['nombre'].value,
      descripcion:     this.aulasEducativasForm.controls['descripcion'].value,
      jornada:         this.aulasEducativasForm.controls['jornada'].value,
      cantidadAlumnos: this.aulasEducativasForm.controls['cantidadAlumnos'].value,
      fecrea: new Date(),
      usercrea: this.ncrypt.decryptWithAsciiSeed(x, this.env.seed, this.env.hashlvl),
      estado: 1,
      permisos: 1
    }

    if ( this.aulasEducativasForm.controls['nombre'].value == undefined || this.aulasEducativasForm.controls['nombre'].value == null || this.aulasEducativasForm.controls['nombre'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del aula educativa vacía.'} )
    else if ( this.aulasEducativasForm.controls['cantidadAlumnos'].value == undefined || this.aulasEducativasForm.controls['cantidadAlumnos'].value == null || this.aulasEducativasForm.controls['cantidadAlumnos'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la cantidad de alumnos vacío.'} )
    else if ( this.aulasEducativasForm.controls['jornada'].value == undefined || this.aulasEducativasForm.controls['jornada'].value == null || this.aulasEducativasForm.controls['jornada'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la jornada vacía.'} )
    else {
      this._show_spinner = true;
      console.warn(this.modelAulasEducativas)

      this.aulas.guardarAulasEducativas(this.modelAulasEducativas).subscribe({
        next: (x) => {
          Toast.fire({
            icon: 'success',
            title: 'Aula generada generado'
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
        }
      })
    }
  }

  actualizarAulasEduactivas() {

    let x: any = sessionStorage.getItem('c_c_r_u');
    this.modelAulasEducativas = {
      id:              this.idAulasEducativas,
      nombre:          this.aulasEducativasForm.controls['nombre'].value,
      descripcion:     this.aulasEducativasForm.controls['descripcion'].value,
      jornada:         this.aulasEducativasForm.controls['jornada'].value,
      cantidadAlumnos: this.aulasEducativasForm.controls['cantidadAlumnos'].value,
      fecrea:          new Date(),
      usercrea:        this.ncrypt.decryptWithAsciiSeed(x, this.env.seed, this.env.hashlvl),
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
            title: 'Aula generada generado'
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
        }

      })
    }
  }

  ObtenerAulasEducativas() {
    this._show_spinner = true;
    let x: any = sessionStorage.getItem('c_c_r_u');
    this.aulas.obtenerAulasEducativas(this.ncrypt.decryptWithAsciiSeed(x, this.env.seed, this.env.hashlvl)).subscribe({
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

  listaFrecuencias: any = [];
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
            this.listaAulasEducativas.splice( i, 1 );
          }
        })
      }
    });
  }

  showFormCreate: boolean = false;
  limpiar() {
    this.aulasEducativasForm.controls['nombre'].setValue('');
    this.aulasEducativasForm.controls['descripcion'].setValue('');
    this.aulasEducativasForm.controls['jornada'].setValue('');
    this.aulasEducativasForm.controls['cantidadAlumnos'].setValue(null);
    this.action_button_aulas = 'Crear';
    this.action_head = 'Crear';
    this.showFormCreate = false;
  }

  idAulasEducativas: number = 0;
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

  filterAulasEd: any;
  filterAulasEde () {
    this.filterAulasEd = this.filterForm.controls['filterAulas'].value;
    this.listaAulasEducativas = this.listaAulasEducativasGhost.filter((item:any) => 
      item.nombre .toLowerCase() .includes(this.filterAulasEd.toLowerCase()) ||
      item.jornada.toLowerCase() .includes(this.filterAulasEd.toLowerCase()) 
    );
  }


}
