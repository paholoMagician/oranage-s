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

  actualizarImgInstituto(url:string, codUser: string) {
    return this.http.get( this.url.apiurl() + 'Instituto/ActualizarImgInstituto/' + url + '/' + codUser );
  }


}
