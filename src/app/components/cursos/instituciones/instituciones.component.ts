import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InstitucionesService } from './services/instituciones.service';
import { EncryptService } from 'src/app/shared/services/encrypt.service';
import { Environments } from 'src/app/environments/environments';
import { StorageService } from '../../services/mediafilesservices/storage.service';
import { HttpEventType } from '@angular/common/http';
import { waitForAsync } from '@angular/core/testing';
import { ModalImgInstitucionesComponent } from './modal-img-instituciones/modal-img-instituciones.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalCursosComponent } from './modal-cursos/modal-cursos.component';

import Swal from 'sweetalert2'
import { CursosService } from './modal-cursos/services/cursos.service';
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
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.scss']
})
export class InstitucionesComponent implements OnInit {
  
  filterCli:string = '';
  _show_spinner:boolean = false;
  link_generate:any;
  isImageSelected: boolean = false;
  selectedFile!: File;
  uploadProgress: number | null = null;
  uploadMessage: string | null = null;
  imagenInstituto: any;
  listaDeInstitutos: any = [];
  _institutos: boolean = false;
  action_button: string = 'Crear';
  listaDeCursos:any = [];
  listaDeCursosGhost:any = [];
  
  listaDeInstitutosGhost:any = [];
  show_update_img: boolean = false;
  idInstituto: number = 0;
  imginst: any;
  modelInstituto: any = [];

  public institucionForm = new FormGroup (
    {
      nombreInstitucion: new FormControl(''),
      descripcion:       new FormControl(''),
      ruc:               new FormControl(''),
      encargado:         new FormControl(''),
      numeroTelefono:    new FormControl(''),
      alias:             new FormControl(''),
      celular:           new FormControl(''),
      estado:            new FormControl(''),
      fechaCrea:         new FormControl('')
    }
  );

  constructor( public dialog: MatDialog,
               private instituto: InstitucionesService,
               private ncrypt: EncryptService,
               private env: Environments,
               private curso: CursosService,
               private storageService: StorageService ) { }

  ngOnInit(): void {
    this.obtenerIntituto();
    const xuser: any = sessionStorage.getItem('c_c_r_u');
    const decrypt = this.ncrypt.decryptWithAsciiSeed(xuser, this.env.seed, this.env.hashlvl);
    this.obtenerCursos( decrypt, 0 );
  }
  
  submit() {
    switch(this.action_button) {
      case 'Crear':
        this.guardarInstitucion();
        break;
      case 'Editar':
        this.actualizarIntituto();
        break;
    }
  }

  guardarInstitucion() {

    if ( this.institucionForm.controls['nombreInstitucion'].value == undefined || this.institucionForm.controls['nombreInstitucion'].value == null || this.institucionForm.controls['nombreInstitucion'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre de la institución vacío.'} )
    else if ( this.institucionForm.controls['descripcion'].value == undefined || this.institucionForm.controls['descripcion'].value == null || this.institucionForm.controls['descripcion'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la descripción de la institución vacía.'} )
    else if ( this.institucionForm.controls['ruc'].value == undefined || this.institucionForm.controls['ruc'].value == null || this.institucionForm.controls['ruc'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el R.U.C. de la institución vacío.'} )
    else if ( this.institucionForm.controls['encargado'].value == undefined || this.institucionForm.controls['encargado'].value == null || this.institucionForm.controls['encargado'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del encargado de la institución vacío.'} )
    else if ( this.institucionForm.controls['numeroTelefono'].value == undefined || this.institucionForm.controls['numeroTelefono'].value == null || this.institucionForm.controls['numeroTelefono'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el numero de teléfono de la institución vacío.'} )
    else {
      const xuser: any = sessionStorage.getItem('c_c_r_u');
      const decrypt = this.ncrypt.decryptWithAsciiSeed(xuser, this.env.seed, this.env.hashlvl);
      this._show_spinner = true;
      this.modelInstituto = {
        nombreInstitucion: this.institucionForm.controls['nombreInstitucion'].value,
        descripcion:       this.institucionForm.controls['descripcion'].value,
        ruc:               this.institucionForm.controls['ruc'].value,
        encargado:         this.institucionForm.controls['encargado'].value,
        numeroTelefono:    this.institucionForm.controls['numeroTelefono'].value,
        celular:           this.institucionForm.controls['celular'].value,
        estado:            1,
        fechaCrea:         new Date(),
        logtipourl:        "",
        usercrea:          decrypt
      }    

      this.instituto.guardarInstitutos(this.modelInstituto).subscribe({
        next: (x) => {
          Toast.fire({
            icon: 'success',
            title: 'Instituto guardado exitosamente'
          })
          this._show_spinner = false;
        }, error: (e) => {
          Toast.fire({
            icon: 'error',
            title: 'Instituto no se ha podido guardadar'
          })
          this._show_spinner = false;
        }, complete: () => {
          this.uploadFile();
          this.obtenerIntituto();
          this.limpiar();
        }
      })
    }
  }

  actualizarIntituto() {
    if      (this.institucionForm.controls['nombreInstitucion'].value   == undefined 
            || this.institucionForm.controls['nombreInstitucion'].value == null || this.institucionForm.controls['nombreInstitucion'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre de la institución vacío.'})
    else if (this.institucionForm.controls['descripcion'].value         == undefined 
            || this.institucionForm.controls['descripcion'].value       == null || this.institucionForm.controls['descripcion'].value       == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la descripción de la institución vacía.'})
    else if (this.institucionForm.controls['ruc'].value                 == undefined 
            || this.institucionForm.controls['ruc'].value               == null || this.institucionForm.controls['ruc'].value               == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el R.U.C. de la institución vacío.'})
    else if (this.institucionForm.controls['encargado'].value           == undefined 
            || this.institucionForm.controls['encargado'].value         == null || this.institucionForm.controls['encargado'].value         == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del encargado de la institución vacío.'})
    else if (this.institucionForm.controls['numeroTelefono'].value      == undefined 
            || this.institucionForm.controls['numeroTelefono'].value    == null || this.institucionForm.controls['numeroTelefono'].value    == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el numero de teléfono de la institución vacío.'})
    else {
      this._show_spinner = true;
      const xuser: any = sessionStorage.getItem('c_c_r_u');
      const decrypt = this.ncrypt.decryptWithAsciiSeed(xuser, this.env.seed, this.env.hashlvl);
      this.modelInstituto = {
        idintituto:        this.idInstituto,
        nombreInstitucion: this.institucionForm.controls['nombreInstitucion'].value,
        descripcion:       this.institucionForm.controls['descripcion'].value,
        ruc:               this.institucionForm.controls['ruc'].value,
        encargado:         this.institucionForm.controls['encargado'].value,
        numeroTelefono:    this.institucionForm.controls['numeroTelefono'].value,
        celular:           this.institucionForm.controls['celular'].value,  
        estado:            1,
        fechaCrea:         new Date(),
        logtipourl:        this.imginst,
        usercrea:          decrypt
      }    

      this.instituto.actualizarIntituto(this.modelInstituto, this.idInstituto).subscribe({
        next: (x) => {
          Toast.fire({
            icon: 'success',
            title: 'Instituto guardado exitosamente'
          })
          this._show_spinner = false;
        }, error: (e) => {
          Toast.fire({
            icon: 'error',
            title: 'Instituto no se ha podido guardadar'
          })
          this._show_spinner = false;
          
        }, complete: () => {
          this.uploadFile();
          this.obtenerIntituto();
          this.limpiar();
        }
      })
    }
  }


  eliminarInstituto( data:any, index:number ) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción es irreversible, y afectará a otros procesos como perdida de información en módulos que dependen de esta jerarquía",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.instituto.eliminarIntituto(data.idintituto).subscribe({
          next:(x) => {
            Swal.fire({
              title: "Instituto eliminado",
              // text: "Your file has been deleted.",
              icon: "success"
            });  
          }, error: (e) => {
            Swal.fire({
              title: "Oops!",
              text: "Algo ha pasado.",
              footer:"#del-in-001",
              icon: "error"
            });

            console.error(e);

          },
          complete: () => {
            this.listaDeInstitutos.splice(index, 1);
          }
        })
      }
    });
  }

  openDialogCursos(data:any [], type: number  ) {   

    const dialogRef = this.dialog.open( ModalCursosComponent, {
      height: 'auto',
      width:  '96%',
      data: [{data}, {tipo: type}],
    });

    dialogRef.afterClosed().subscribe( result => {
      console.warn( result );
      const xuser: any = sessionStorage.getItem('c_c_r_u');
      const decrypt = this.ncrypt.decryptWithAsciiSeed(xuser, this.env.seed, this.env.hashlvl);
      this.obtenerCursos( decrypt, 0 );
    });

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
  

  openDialogImagenInstituto(data:any): void {

    const dialogRef = this.dialog.open( ModalImgInstitucionesComponent, {
      height: 'auto',
      width:  '96%',
      data: data,
    });

    dialogRef.afterClosed().subscribe( result => {
      this.obtenerIntituto();
    });

  }

  catchData( data:any ) {
    this.show_update_img = true;
    this.institucionForm
        .controls['nombreInstitucion']
        .setValue(data.nombreInstitucion);
    this.institucionForm
        .controls['descripcion']
        .setValue(data.descripcion);
    this.institucionForm
        .controls['ruc']
        .setValue(data.ruc);
    this.institucionForm
        .controls['encargado']
        .setValue(data.encargado);
    this.institucionForm
        .controls['numeroTelefono']
        .setValue(data.numeroTelefono);
    this.institucionForm
        .controls['celular']
        .setValue(data.celular);
    this.idInstituto   = data.idintituto;
    this.action_button = 'Editar';
    this.imginst       = data.logtipourl;
    // this.imagenInstituto = this.env.apiUrlStorageIntituto() + data.logtipourl;
  }
  
  limpiar() {
    this.institucionForm.controls['nombreInstitucion'].setValue('');
    this.institucionForm.controls['descripcion'].setValue('');
    this.institucionForm.controls['ruc'].setValue('');
    this.institucionForm.controls['encargado'].setValue('');
    this.institucionForm.controls['numeroTelefono'].setValue('');
    this.institucionForm.controls['celular'].setValue('');
    this.action_button   = 'Crear';
    this.show_update_img = false;
    this._institutos     = false; 
  }

  obtenerIntituto() {
    const xuser: any = sessionStorage.getItem('c_c_r_u');
    const decrypt = this.ncrypt.decryptWithAsciiSeed(xuser, this.env.seed, this.env.hashlvl);

    this.instituto.obtenerInstitutos( decrypt ).subscribe({
      next: (x) => {
        this.listaDeInstitutos = x;
        this.listaDeInstitutosGhost = x;
        this.imagenInstituto = this.env.apiUrlStorageIntituto();
      }, error: (e) => {
        console.error(e);
      }, complete: () => {
        console.log(this.listaDeInstitutos);
      }
    })
  }
  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const allowedImageExtensions = ['.jpg', '.jpeg', '.png'];
      const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase();
      this.isImageSelected = fileExtension ? allowedImageExtensions.includes('.' + fileExtension) : false;
    } else {
      this.isImageSelected = false;
    }
  }


  actualizarImagenUrl(url:string) {
    this._show_spinner = true;
    this.instituto.actualizarImgInstituto( url, this.idInstituto.toString() ).subscribe(
    {
      next:() => {
        console.warn('Imagen editada');
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = true;
      }
    })

  }

  uploadFile() {
    if (this.selectedFile) {
      
      this.uploadProgress = null;
      this.uploadMessage = null;
      
      const originalFileName = this.selectedFile.name;
      const fileNameWithUnderscores = originalFileName.replace(/ /g, "_");
      
      this.selectedFile = new File([this.selectedFile], fileNameWithUnderscores);
  
      this.storageService.uploadInstituto(this.selectedFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            this.uploadMessage = 'Imagen actualizada con éxito.';
          }
          // this._show_spinner = false;
        },
        error: (error) => {
          this.uploadMessage = 'Error al actualizar la imagen.';
          console.error('Error al cargar el archivo:', error);
          // this._show_spinner = false;
        },
        complete: () => {
          this.link_generate = fileNameWithUnderscores;
          this.imagenInstituto = this.env.apiUrlStorageIntituto()+fileNameWithUnderscores;
          this.actualizarImagenUrl(this.link_generate);
        }
      });

    }

  }

  filterCliente () {
    this.listaDeCursos = this.listaDeCursosGhost.filter((item:any) => 
      item.nombre.toLowerCase().includes(this.filterCli.toLowerCase()) ||
      item.modalidad.toLowerCase().includes(this.filterCli.toLowerCase())
    );
  }

  filterInitit:string = '';
  filterInstitutos () {
    this.listaDeInstitutos = this.listaDeInstitutosGhost.filter((item:any) => 
      item.nombreInstitucion.toLowerCase().includes(this.filterInitit.toLowerCase()) ||
      item.encargado.toLowerCase().includes(this.filterInitit.toLowerCase())
    );
  }


}
