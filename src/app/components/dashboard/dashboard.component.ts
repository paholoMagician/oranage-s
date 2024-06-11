import { Component, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import { LoginService } from '../login/services/login.service';
import { DashboardService } from '../services/dashboard.service';
import { Environments } from 'src/app/environments/environments';
import { Router } from '@angular/router';
import { EncryptService } from 'src/app/shared/services/encrypt.service';
import { FocusTrackingService } from '../services/focus-tracking.service';
import { PerfilService } from '../perfil/services/perfil.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnChanges {
  _show_spinner:boolean = false;
  imagenPerfil:any
  view_perfil:       boolean = false;
  view_task_manager: boolean = false;
  view_messenger:    boolean = false;
  view_config:       boolean = false;
  view_cursos:       boolean = false;
  view_estudiantes:  boolean = false;
  view_calendar   :  boolean = false;
  view_profesores :  boolean = false;

  nombreUsuario: string = '';

  constructor( private login: LoginService,
    private perfil: PerfilService,
    private dash: DashboardService,
    private env: Environments,
    private route: Router,
    private ncrypt: EncryptService,
    private focusTrackingService: FocusTrackingService 
    ) { }


  ngOnInit(): void {
      this.login.validate();
      const xuser: any = sessionStorage.getItem('c_n_r_a');
      this.nombreUsuario = 'Hola! ' + this.ncrypt.decryptWithAsciiSeed(xuser, this.env.seed, this.env.hashlvl);
      this.obtenerperfil();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes) {
       
    }
  }

  moduloSeleccionado: any = [];
  moduleName:string       = '';
  icon:string             = '';
  recibirModuloSeleccionado(moduloSeleccionado: any) {
    this.moduloSeleccionado = moduloSeleccionado;
    console.warn(this.moduloSeleccionado);
    this.moduleName = this.moduloSeleccionado.moduleName;
    this.icon = this.moduloSeleccionado.icon;
    switch(this.moduloSeleccionado.id) {
      case 1:
        this.view_perfil = false;
        this.view_task_manager = true;
        this.view_cursos = false;
        this.view_estudiantes = false;
        this.view_calendar = false;
        this.view_profesores = false;
        break;
      case 2:
        this.view_perfil = false;
        this.view_task_manager = false;
        this.view_cursos = false;
        this.view_estudiantes = false;
        this.view_calendar = false;
        this.view_profesores = false;
        break;
      case 3:
        this.view_perfil = true;
        this.view_task_manager = false;
        this.view_cursos = false;
        this.view_estudiantes = false;
        this.view_calendar = false;
        this.view_profesores = false;
        break;
      case 4:
        this.view_perfil = false;
        this.view_task_manager = false;
        this.view_cursos = false;
        this.view_estudiantes = false;
        this.view_calendar = false;
        this.view_profesores = false;
        break;      
      case 5:
        this.view_perfil = false;
        this.view_task_manager = false;
        this.view_cursos = true;
        this.view_estudiantes = false;
        this.view_calendar = false;
        this.view_profesores = false;
        break;      
      case 1005:
        this.view_perfil = false;
        this.view_task_manager = false;
        this.view_cursos = false;
        this.view_estudiantes = true;
        this.view_calendar = false;
        this.view_profesores = false;
        break;      
      case 1006:
        this.view_perfil = false;
        this.view_task_manager = false;
        this.view_cursos = false;
        this.view_estudiantes = false;
        this.view_calendar = true;
        this.view_profesores = false;
        break;      
      case 1011:
        this.view_perfil = false;
        this.view_task_manager = false;
        this.view_cursos = false;
        this.view_estudiantes = false;
        this.view_calendar = false;
        this.view_profesores = true;
        break;      
    }

  }


  recibirImagenPerfil(imageperfil:any) {
    this.imagenPerfil = imageperfil;
    console.warn(this.imagenPerfil);
  }

  listaPerfil:any = [];  
  obtenerperfil() {
    this._show_spinner = true;
    const token: any = sessionStorage.getItem('c_c_r_u');
    let decodec: any = this.ncrypt.decryptWithAsciiSeed(token,this.env.seed, this.env.hashlvl);
    this.perfil.obtenerPerfil(decodec).subscribe({
      next: (x) => {
        this.listaPerfil = x;
        console.warn('this.listaPerfil');
        console.warn(this.listaPerfil);
        this.imagenPerfil = this.env.apiUrlStoragePerfil() + this.listaPerfil[0].fotoperfilA;
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }
    })
  }


}
