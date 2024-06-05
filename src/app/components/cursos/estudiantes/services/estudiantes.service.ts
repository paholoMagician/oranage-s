import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

  constructor( private http: HttpClient, private url: Environments ) { }

  guardarEstudiantes(model:any[]) {
    return this.http.post( this.url.apiurl() + 'Estudiantes/guardarEstudiante', model );
  }

  actualizarEstudiantes( id:number, model:any[] ) {
    return this.http.put( this.url.apiurl() + 'Estudiantes/ActualizarEstudiante/'+ id, model );
  }

  actualizarEstudiantesCurso(model:any[]) {
    return this.http.put( this.url.apiurl() + 'Estudiantes/ActualizarEstudianteCurso', model );
  }

  guardarEstudiantesCurso(model:any[]) {
    return this.http.post( this.url.apiurl() + 'Estudiantes/guardarEstudiaCurso', model );
  }

  obtenerEstudiantes( usercrea:string, tipo: number ) {
    return this.http.get( this.url.apiurl() + 'Estudiantes/ObtenerEstudiante/'+usercrea+'/'+tipo );
  }


}
