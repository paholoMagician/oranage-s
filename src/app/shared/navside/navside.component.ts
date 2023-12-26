import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginService } from 'src/app/components/login/services/login.service';
import { DashboardService } from 'src/app/components/services/dashboard.service';
import { FocusTrackingService } from 'src/app/components/services/focus-tracking.service';
import { EncryptService } from '../services/encrypt.service';
import { Environments } from 'src/app/environments/environments';

@Component({
  selector: 'app-navside',
  templateUrl: './navside.component.html',
  styleUrls: ['./navside.component.scss']
})
export class NavsideComponent implements OnInit {
  
  @Output() moduloSeleccionado = new EventEmitter<any>();
  
  mini_navside: boolean = true;
  activeModule: number | null = null;
  moduloElejido: any;
  listaModulos:any = [];

  constructor( private login: LoginService,
               private dash: DashboardService,
               private env: Environments,
               private ncrypt: EncryptService,
               private focusTrackingService: FocusTrackingService ) { }

  ngOnInit(): void {
      this.modulos();

  }

  obtenerModulos(modulos: any) {
    this.moduloElejido = modulos;
    this.moduloSeleccionado.emit(this.moduloElejido);
  }

  setActiveModule(index: number) {
    this.activeModule = index;
  }

  cerrarSession() {
    this.login.closeSession();
    this.login.validate();
  }

  resetActiveModule() {
    this.activeModule = null;
  }

  modulos() {
    const xcoduser: any = sessionStorage.getItem('c_c_r_u');

    console.warn(this.ncrypt.decryptWithAsciiSeed( xcoduser, this.env.seed, this.env.hashlvl ));

    this.login.obtenerModulos(this.ncrypt.decryptWithAsciiSeed(xcoduser, this.env.seed, this.env.hashlvl)).subscribe({
        next: (mod) => {
          this.listaModulos = mod;
          console.warn(this.listaModulos);
        }
      }
    )
  }

}
