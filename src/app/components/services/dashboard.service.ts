import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor( private env: Environments, private http: HttpClient  ) { }

  guardarMensaje( model:any[] ) {
    return this.http.post( this.env.apiurl()+'Mensajes/guardarMensaje',model);
  }
  
  generateRandomString = (num: any) => {
    const characters ='-_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1= '';
    const charactersLength = characters.length;
    for ( let i = 0; i < num; i++ ) {
      result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result1;
  }
  
  obtenerMesj(coduser:any) {
    return this.http.get(this.env.apiurl()+'Mensajes/ObtenerMensajes/'+coduser)
  }
  
  actualizarMensajes( codmsj:string, model:any[] ) {
    return this.http.put(this.env.apiurl()+'Mensajes/actualizarMensaje/'+codmsj, model);
  }

  tareaCompletada(codmsj:string, ctipo:string) {
    return this.http.get(this.env.apiurl()+'Mensajes/TareaCompletada/' + codmsj + '/' + ctipo );
  }

  eliminarMsj(idmsj:any) {
    return this.http.get(this.env.apiurl()+'Mensajes/EliminarMensajes/'+idmsj)
  }
  
  estadoMSJ( estado:number, coduser:string, codmsj: string ) {
    return this.http.get(this.env.apiurl()+'Mensajes/EstadoMsj/'+estado+'/'+coduser+'/'+codmsj);
  }
  
  guardarCommunity(model:any []) {
    return this.http.post( this.env.apiurl()+'Community/guardarComunnity',model);
  }
  
  gestionarComunidad( codcommunity:string, tp:number, invit:string ) {
    return this.http.get( this.env.apiurl()+'Community/GestionComunidad/'+codcommunity+'/'+tp+'/'+invit );
  }
  
  EliminarComunidadUsuario( codcommunity:string, invit:string ) {
    return this.http.get( this.env.apiurl()+'Community/eliminarUsuarioCounnidad/'+codcommunity+'/'+invit );
  }

  actualizarComunidad( model:any = [] ) {
    return this.http.post( this.env.apiurl() + 'Community/EditarComunidad', model )
  }

  obtenerUsuarioGeneral() {
    return this.http.get(this.env.apiurl()+'Usuario/ObtenerUsusariosGeneral');
  }
  
  guardarUsuario(model:any[]) {
    return this.http.post(this.env.apiurl()+'Usuario/guardarUsuario', model);
  }
  
  obtenerInvitacionesComunidadesNoAceptadas( estado: number, coduser:string, permison: number, type:number ) {
    return this.http.get(this.env.apiurl()+'Community/ObtenerComunnity/'+estado+'/'+coduser+'/' + permison + '/' + type);
  }

  actualizarEstadoInvitacion( estado: number, coduser:string, permison: number, type:number, ccommunity:string ) {
    return this.http.get(this.env.apiurl()+'Community/EstadoInvitacion/'+estado+'/'+coduser+'/' + permison+'/'+ type+'/'+ccommunity);
  }
  
  eliminarInvitacion( id:number ) {
    return this.http.get(this.env.apiurl()+'Community/eliminarInvitacion/'+id);
  }
  
  ObtenerComunnityPerteneciente( coduser:string, type:number ) {
    return this.http.get(this.env.apiurl()+'Community/ObtenerComunnityPerteneciente/'+coduser+'/'+type);
  }

  obtenerReaction( codpost: string ) {
    return this.http.get(this.env.apiurl()+'PostReaction/ObtenerReactionPost/'+codpost);
  }


}
