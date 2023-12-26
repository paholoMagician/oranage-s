import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor( private http: HttpClient, private url: Environments ) { }
  
  guardarPerfil(model:any[]) {
    return this.http.post( this.url.apiurl() + 'Perfil/guardarPerfil', model );
  }

  obtenerPerfil( coduser:string ) {
    return this.http.get( this.url.apiurl() + 'Perfil/ObtenerPerfil/' + coduser );
  }

  actualizarPerfil( coduser:string, model:any [] ) {
    return this.http.put( this.url.apiurl() + 'Perfil/ActualizarPerfil/' + coduser, model );
  }

  actualizarImgPerfil( url:string, coduser:string ) {
    return this.http.get( this.url.apiurl() + 'Perfil/ActualizarImgPerfil/' + url + '/' + coduser );
  }

  actualizarPass( pass:string, codUser:string ) {
    return this.http.get( this.url.apiurl() + 'Usuario/ActualizarPass/' + pass + '/' + codUser );
  }

}
