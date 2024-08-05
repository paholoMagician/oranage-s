import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AulasEducativasService {

  constructor( private http: HttpClient, private url: Environments ) { }

  guardarAulasEducativas(model:any) {
    return this.http.post( this.url.apiurl() + 'AulasEducativas/guardarAulasEducativas', model );
  }

  actualizarAulasEduactivas(id:number, model:any) {
    return this.http.put( this.url.apiurl() + 'AulasEducativas/ActualizarAulasEduactivas/'+ id, model );
  }
  
  obtenerAulasEducativas(usercrea: string) {
    return this.http.get( this.url.apiurl() + 'AulasEducativas/ObtenerAulasEducativas/' + usercrea );
  }
  
  eliminarAulasEducativas(id: number) {
    return this.http.get( this.url.apiurl() + 'AulasEducativas/EliminarAulasEducativas/' + id );
  }

  
}
