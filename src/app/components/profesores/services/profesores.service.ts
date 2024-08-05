import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProfesoresService {

  constructor( private http: HttpClient, private url: Environments ) { }

  guardarProfesores(model:any[]) {
    return this.http.post( this.url.apiurl() + 'Profesores/guardarProfesores', model );
  }

  actualizarProfesores(id:number, model: any []) {
    return this.http.put( this.url.apiurl() + 'Profesores/ActualizarProfesor/' + id, model );
  }

  obtenerProfesores( usercrea: string ) {
    return this.http.get( this.url.apiurl() + 'Profesores/ObtenerProfesores/'+usercrea );
  }

  eliminarProfesores( id: number ) {
    return this.http.get( this.url.apiurl() + 'Profesores/EliminarProfesores/'+id );
  }


}
 