import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class InstitucionesService {

  constructor( private http: HttpClient, private url: Environments ) { }
  
  guardarInstitutos(model:any[]) {
    return this.http.post( this.url.apiurl() + 'Instituto/guardarInstituto', model );
  }

  actualizarIntituto( model:any, id: number ) {
    return this.http.put( this.url.apiurl() + 'Instituto/ActualizarInstituto/' + id, model );
  }

  actualizarImgInstituto(url:string, codUser: string) {
    return this.http.get( this.url.apiurl() + 'Instituto/ActualizarImgInstituto/' + url + '/' + codUser );
  }

  obtenerInstitutos(uscod:string) {
    return this.http.get( this.url.apiurl() + 'Instituto/ObtenerInstituciones/' + uscod );
  }

  eliminarIntituto( idisntituto:any ) {
    return this.http.get( this.url.apiurl() + 'Instituto/EliminarInstituto/' + idisntituto );
  }

}
