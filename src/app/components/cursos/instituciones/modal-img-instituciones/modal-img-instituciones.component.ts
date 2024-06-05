import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InstitucionesComponent } from '../instituciones.component';
import { Environments } from 'src/app/environments/environments';
import { InstitucionesService } from '../services/instituciones.service';
import { StorageService } from 'src/app/components/services/mediafilesservices/storage.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-modal-img-instituciones',
  templateUrl: './modal-img-instituciones.component.html',
  styleUrls: ['./modal-img-instituciones.component.scss']
})
export class ModalImgInstitucionesComponent implements OnInit {
  _show_spinner: boolean = false;
  link_generate:any;
  isImageSelected: boolean = false;
  selectedFile!: File;
  uploadProgress: number | null = null;
  uploadMessage: string | null = null;
  imagenInstituto: any;
  show_update_img: boolean = false;
  idInstituto: number = 0;
  constructor(private storageService: StorageService, 
    public dialogRef: MatDialogRef<InstitucionesComponent>,private env: Environments, @Inject(MAT_DIALOG_DATA) public data: any,private instituto: InstitucionesService,) {}
  

  ngOnInit(): void {
    console.log('>>>>>>>>>>>>');
    console.log(this.data);
    this.idInstituto = this.data.idintituto
    console.log('>>>>>>>>>>>>');
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
        // console.warn('Imagen editada');
        // alert('Imagen editada con exito')
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = true;
      }
    })

  }

  uploadFile() {
    // this._show_spinner = true;
    if (this.selectedFile) {
      
      this.uploadProgress = null;
      this.uploadMessage = null;
      
      const originalFileName = this.selectedFile.name;
      const fileNameWithUnderscores = originalFileName.replace(/ /g, "_");
      
      this.selectedFile = new File([this.selectedFile], fileNameWithUnderscores);  
      this.storageService.uploadInstituto(this.selectedFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(( 100 * event.loaded ) / event.total );
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

  

}
