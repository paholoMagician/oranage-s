import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2'
import { InstitucionesService } from './services/instituciones.service';
import { EncryptService } from 'src/app/shared/services/encrypt.service';
import { Environments } from 'src/app/environments/environments';
import { StorageService } from '../../services/mediafilesservices/storage.service';
import { HttpEventType } from '@angular/common/http';
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

  constructor( private instituto: InstitucionesService, private ncrypt: EncryptService, private env: Environments, private storageService: StorageService ) { }

  ngOnInit(): void {
    this.obtenerIntituto();
  }
  
  submit() {
    switch(this.action_button) {
      case 'Crear':
        this.guardarInstitucion();
        break;
      case 'Actualizar':
        this.actualizarIntituto();
        break;
    }
  }

  modelInstituto: any = [];
  guardarInstitucion() {

    if ( this.institucionForm.controls['nombreInstitucion'].value == undefined || this.institucionForm.controls['nombreInstitucion'].value == null || this.institucionForm.controls['nombreInstitucion'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre de la institución vacío.'} )
    else if ( this.institucionForm.controls['descripcion'].value == undefined || this.institucionForm.controls['descripcion'].value == null || this.institucionForm.controls['descripcion'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la descripción de la institución vacía.'} )
    else if ( this.institucionForm.controls['ruc'].value == undefined || this.institucionForm.controls['ruc'].value == null || this.institucionForm.controls['ruc'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el R.U.C. de la institución vacío.'} )
    else if ( this.institucionForm.controls['encargado'].value == undefined || this.institucionForm.controls['encargado'].value == null || this.institucionForm.controls['encargado'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del encargado de la institución vacío.'} )
    else if ( this.institucionForm.controls['numeroTelefono'].value == undefined || this.institucionForm.controls['numeroTelefono'].value == null || this.institucionForm.controls['numeroTelefono'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el numero de teléfono de la institución vacío.'} )
    else {
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
        logtipourl:        ""
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
        }
      })
    }
  }

  actualizarIntituto() {
    if (this.institucionForm.controls['nombreInstitucion'].value   == undefined || this.institucionForm.controls['nombreInstitucion'].value == null || this.institucionForm.controls['nombreInstitucion'].value == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre de la institución vacío.'})
    else if (this.institucionForm.controls['descripcion'].value    == undefined || this.institucionForm.controls['descripcion'].value       == null || this.institucionForm.controls['descripcion'].value       == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar la descripción de la institución vacía.'})
    else if (this.institucionForm.controls['ruc'].value            == undefined || this.institucionForm.controls['ruc'].value               == null || this.institucionForm.controls['ruc'].value               == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el R.U.C. de la institución vacío.'})
    else if (this.institucionForm.controls['encargado'].value      == undefined || this.institucionForm.controls['encargado'].value         == null || this.institucionForm.controls['encargado'].value         == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el nombre del encargado de la institución vacío.'})
    else if (this.institucionForm.controls['numeroTelefono'].value == undefined || this.institucionForm.controls['numeroTelefono'].value    == null || this.institucionForm.controls['numeroTelefono'].value    == '') Toast.fire({ icon: 'warning', title: 'No puedes dejar el numero de teléfono de la institución vacío.'})
    else {
      this._show_spinner = true;
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
        logtipourl:        this.imagenInstituto
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
        }
      })
    }
  }
  idInstituto: number = 0;
  catchData( data:any ) {
    console.warn(data)
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
    this.idInstituto = data.idintituto;
    this.action_button = 'Editar';
    this.imagenInstituto = this.env.apiUrlStoragePerfil() + data.logtipourl;
    // this.selectedFile = data.logtipourl;
  }

  limpiar() {
    this.institucionForm.controls['nombreInstitucion'].setValue('')
    this.institucionForm.controls['descripcion'].setValue('')
    this.institucionForm.controls['ruc'].setValue('')
    this.institucionForm.controls['encargado'].setValue('')
    this.institucionForm.controls['numeroTelefono'].setValue('')
    this.institucionForm.controls['celular'].setValue('')
    this.action_button = 'Crear';
  }

  obtenerIntituto() {
    const xuser: any = sessionStorage.getItem('c_c_r_u');
    const decrypt = this.ncrypt.decryptWithAsciiSeed(xuser, this.env.seed, this.env.hashlvl);
    this.instituto.obtenerInstitutos( decrypt ).subscribe({
      next: (x) => {
        this.listaDeInstitutos = x;
      }, error: (e) => {
        console.error(e);
      }, complete: () => {

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

    const token: any = sessionStorage.getItem('c_c_r_u');
    let decodec: any = this.ncrypt.decryptWithAsciiSeed(token,this.env.seed, this.env.hashlvl);
    this._show_spinner = true;
    this.instituto.actualizarImgInstituto( url, decodec ).subscribe({
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
    this._show_spinner = true;
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
          this._show_spinner = false;
        },
        error: (error) => {
          this.uploadMessage = 'Error al actualizar la imagen.';
          console.error('Error al cargar el archivo:', error);
          this._show_spinner = false;
        },
        complete: () => {
          this.link_generate = fileNameWithUnderscores;
          this.imagenInstituto = this.env.apiUrlStoragePerfil()+fileNameWithUnderscores;
          this.actualizarImagenUrl(this.link_generate);
        }
      });

    }

  }


}
