import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Environments } from 'src/app/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private http: HttpClient, private url: Environments, private route:Router ) { }

  logUser( model:any [] ) {
    return this.http.post( this.url.apiurl() + 'Login/login', model );
  }

  validate() {
    let email:any    = sessionStorage.getItem('c_e_r_m');
    let nombre:any   = sessionStorage.getItem('c_n_r_a');
    let UserCod: any = sessionStorage.getItem('c_c_r_u');
    if( UserCod == undefined || UserCod == null || UserCod == '' ) {
      // alert('no existe')
      this.route.navigate(['login']);
    } else {
      // alert('si existe')
      this.route.navigate(['dashboard']);
    }
  }

  guardarUsuario(model:any[]) {
    return this.http.post( this.url.apiurl() + 'Usuario/guardarUsuario', model );
  }

  guardarPerfil(model:any[]) {
    return this.http.post( this.url.apiurl() + 'Perfil/guardarPerfil', model );
  }

  closeSession() {
    sessionStorage.removeItem('c_e_r_m');
    sessionStorage.removeItem('c_c_r_u');
    sessionStorage.removeItem('c_n_r_a');
  }

  crearCuenta( usercod:string, ccia:string, tcuenta:string ) {
    return this.http.get( this.url.apiurl() + 'Usuario/CrearCuentas/' + usercod + '/' + ccia + '/' + tcuenta );
  }

  guardarUbicacion( model:any [] ) {
    return this.http.post( this.url.apiurl() + 'Usuario/guardarUsuarioUbicacion', model );
  }
  
  obtenerModulos( coduser:string ) {
    return this.http.get( this.url.apiurl() + 'Modulos/GetModulos/'+coduser );
  }
  
  obtenerModulosDetalles( id:number ) {
    return this.http.get( this.url.apiurl() + 'Modulos/ObtenerDetalleModulo/'+id );
  }
}
