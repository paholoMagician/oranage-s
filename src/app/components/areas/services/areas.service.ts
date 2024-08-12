import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AreasService {
  
  constructor( private http: HttpClient, private url: Environments ) { }

  guardarAreaEduactiva(model:any[]) {
    return this.http.post( this.url.apiurl() + 'AreaEstudiantil/guardarAreaEducativa', model );
  }

  guardarAreaAcademica(model:any[]) {
    return this.http.post( this.url.apiurl() + 'AreaEstudiantil/guardarAreaAcademica', model );
  }

  guardarMaterias(model:any[]) {
    return this.http.post( this.url.apiurl() + 'Materias/guardarMaterias', model );
  }

  ActualizarAreaEducativa(id: number, model:any[]) {
    return this.http.put( this.url.apiurl() + 'AreaEstudiantil/ActualizarAreaEducativa/' + id, model );
  }

  ActualizarAreaAcademica(id: number, model:any[]) {
    return this.http.put( this.url.apiurl() + 'AreaEstudiantil/ActualizarAreaAcademica/' + id, model );
  }

  ActualizarMateria(id: number, model:any[]) {
    return this.http.put( this.url.apiurl() + 'Materias/ActualizarMateria/' + id, model );
  }

  obtenerAreas(usercrea: string, tipo: string) {
    return this.http.get( this.url.apiurl() + 'AreaEstudiantil/ObtenerAreaEducativa/' + usercrea + '/' + tipo );
  }

  EliminarAreaAcademica(id: number) {
    return this.http.get( this.url.apiurl() + 'AreaEstudiantil/EliminarAreaAcademica/' + id );
  }

  EliminarAreaEducativa(id: number) {
    return this.http.get( this.url.apiurl() + 'AreaEstudiantil/EliminarAreaEducativa/' + id );
  }

  EliminarMaterias(id: number) {
    return this.http.get( this.url.apiurl() + 'Materias/eliminarMateria/' + id );
  }
  
}
