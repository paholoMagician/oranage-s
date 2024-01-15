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

}
