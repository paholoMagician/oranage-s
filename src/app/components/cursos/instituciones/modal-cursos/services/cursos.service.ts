import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CursosService {

  constructor( private http: HttpClient, private url: Environments ) { }
  
  guardarCursos(model:any[]) {
    return this.http.post( this.url.apiurl() + 'Cursos/guardarCursos', model );
  }

  obtenerCursos(id:any, type: number) {
    return this.http.get( this.url.apiurl() + 'Cursos/ObtenerCursos/' + id + '/' + type);
  }

  actualizarCursos( id:any, model: any [] ) {
    return this.http.put( this.url.apiurl() + 'Cursos/ActualizarCursos/' + id, model )
  }

}
