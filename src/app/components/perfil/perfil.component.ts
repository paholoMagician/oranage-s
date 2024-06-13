import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { PerfilService } from './services/perfil.service';
import { EncryptService } from 'src/app/shared/services/encrypt.service';
import { Environments } from 'src/app/environments/environments';
import { StorageService } from '../services/mediafilesservices/storage.service';
import { HttpEventType } from '@angular/common/http';
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
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit{

  _show_spinner:boolean = false;

  @Output() imagenPerfilEmit: EventEmitter<any> = new EventEmitter<any>();

  listaPerfil: any =[];
  link_generate:any;
  listapaises:any = [];
  isImageSelected: boolean = false;
  selectedFile!: File;
  uploadProgress: number | null = null;
  uploadMessage: string | null = null;
  imagenPerfil: any;
  public perfilForm = new FormGroup({
    email:        new FormControl(''),
    password:     new FormControl(''),
    nombre:       new FormControl(''),
    apellido:     new FormControl(''),
    observacion:  new FormControl(''),
    alias:        new FormControl(''),
    codpais:      new FormControl(''),
    codprov:      new FormControl(''),
    fotoperfilA:  new FormControl(''),
    fotoperfilB:  new FormControl(''),
    fotoperfilC:  new FormControl(''),
    edad:         new FormControl(''),
    celular:      new FormControl('')
  });

  public filterFormPass = new FormGroup(
    {
      password:   new FormControl('')
    }
  )


  constructor( private sharedservs: SharedService,
               private perfil: PerfilService,
               private env: Environments,
               private ncrypt: EncryptService,
               private storageService: StorageService ) {}

  ngOnInit() {
    this.getDataMaster('P00');
    this.obtenerperfil();
  }


  obtenerperfil() {
    this._show_spinner = true;
    const token: any = sessionStorage.getItem('c_c_r_u');
    let decodec: any = this.ncrypt.decryptWithAsciiSeed(token,this.env.seed, this.env.hashlvl);
    this.perfil.obtenerPerfil(decodec).subscribe({
      next: (x) => {
        this.listaPerfil = x;
        console.warn('data perfil');
        console.warn(this.listaPerfil);
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }, complete: () => {
        if( this.listaPerfil ) {

          this.perfilForm.controls['alias'].setValue( this.listaPerfil[0].nombre1 );
          this.perfilForm.controls['nombre'].setValue( this.listaPerfil[0].nombre );
          this.perfilForm.controls['apellido'].setValue( this.listaPerfil[0].apellido );
          this.perfilForm.controls['email'].setValue( this.listaPerfil[0].email );
          this.perfilForm.controls['observacion'].setValue( this.listaPerfil[0].observacion );
          this.perfilForm.controls['codprov'].setValue( this.listaPerfil[0].ciudad );
          this.perfilForm.controls['codpais'].setValue( this.listaPerfil[0].codpais );
          this.perfilForm.controls['celular'].setValue( this.listaPerfil[0].celular );
          this.perfilForm.controls['edad'].setValue( this.listaPerfil[0].edad );
          this.imagenPerfil = this.env.apiUrlStoragePerfil() + this.listaPerfil[0].fotoperfilA;
          this.filterFormPass.controls['password'] = this.listaPerfil[0].password;
      
        }
      }
    })
  }

  submit() {
    this.actualizarPerfil();
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

  ordenarPaisesAscendente() {
    if (this.listapaises) {
      this.listapaises.sort((a:any, b:any) => {
        const nombreA = a.nombre.toLowerCase();
        const nombreB = b.nombre.toLowerCase();
        return nombreA.localeCompare(nombreB);
      });
    }
  }

  modelPerfil:any = [];
  actualizarPerfil() {
    this._show_spinner = true;
    const token: any = sessionStorage.getItem('c_c_r_u');
    let decodec: any = this.ncrypt.decryptWithAsciiSeed(token,this.env.seed, this.env.hashlvl);
    this.modelPerfil = {
      "nombre":      this.perfilForm.controls['nombre'].value,
      "apellido":    this.perfilForm.controls['apellido'].value,
      "observacion": this.perfilForm.controls['observacion'].value,
      "email":       this.perfilForm.controls['email'].value,
      "alias":       this.perfilForm.controls['alias'].value,
      "codpais":     this.perfilForm.controls['codpais'].value,
      "codprov":     "",
      "coduser":     decodec,
      "fotoperfilA": this.link_generate,
      "fotoperfilB": "",
      "fotoperfilC": "",
      "celular":     this.perfilForm.controls['celular'].value,
      "edad":        this.perfilForm.controls['edad'].value,
      "ciudad":      this.perfilForm.controls['codprov'].value
    }

    this.perfil.actualizarPerfil(decodec, this.modelPerfil).subscribe({
      next:() => {
        this._show_spinner = false;
      },
      error: (e) => {
        Toast.fire({
          icon: 'error',
          title: 'Hubo un error al actualizar el perfil'
        })
        this._show_spinner = false;
      },
      complete: () => {
        Toast.fire({
          icon: 'success',
          title: 'Perfil Actualizado exitosamente'
        })
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
    this.perfil.actualizarImgPerfil( url, decodec ).subscribe({
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
  
      this.storageService.uploadFilePerfil(this.selectedFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            console.warn(this.selectedFile);
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
          this.imagenPerfil = this.env.apiUrlStoragePerfil()+fileNameWithUnderscores;
          console.warn(1)
          this.imagenPerfilEmit.emit(this.imagenPerfil);
          console.warn(2)
          this.actualizarImagenUrl(this.link_generate);
        }
      });

    }

  }

  actualizarPassword() {
    this._show_spinner = true;
    const token: any = sessionStorage.getItem('c_c_r_u');
    let decodec: any = this.ncrypt.decryptWithAsciiSeed(token,this.env.seed, this.env.hashlvl);
    let pass:any = this.filterFormPass.controls['password'].value;
    this.perfil.actualizarPass(pass, decodec).subscribe({
      next: (x) => {
        Toast.fire({
          icon: 'success',
          title: 'Password actualizado exitosamente'
        })
        this._show_spinner = false;
      }, error: (e) => {
        Toast.fire({
          icon: 'error',
          title: 'Password no se ha podido actualizadar'
        })
        this._show_spinner = false;
      }
    })
  }

}
