import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { DashboardService } from '../services/dashboard.service';
import { FocusTrackingService } from '../services/focus-tracking.service';
import { FormControl, FormGroup } from '@angular/forms';
import { IpService } from '../services/ip.service';
import Swal from 'sweetalert2'
import { Environments } from 'src/app/environments/environments';
import { Router } from '@angular/router';
import { EncryptService } from 'src/app/shared/services/encrypt.service';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoginActive: boolean = false;
  isSignUpActive: boolean = false;

  publicIpAddress: string | null = null;
  _log:boolean     = true;
  _login:boolean   = true;
  _signUp:boolean  = false;
  btnDis:boolean   = true;
  msjSignUp:string = '';
  modelUbicacion: any = [];
  modelUser: any   = [];

  versionamiento: string = '';

  public loginForm = new FormGroup({
    email:    new FormControl(''),
    password: new FormControl('')
  });

  public signForm = new FormGroup({
    nombre:    new FormControl(''),
    email:    new FormControl(''),
    password: new FormControl(''),
    repassword: new FormControl('')
  });

  constructor( private login: LoginService,
               private dash: DashboardService,
               private ipService: IpService, 
               private env: Environments,
               private route: Router,
               private ncrypt: EncryptService,
               private focusTrackingService: FocusTrackingService 
               ) { }

               ngOnInit(): void {
                   this.versionamiento = this.env.version;
                   this.login.validate();
               }

  onInputFocus() {
    this.focusTrackingService.inputHasFocus = true;
  }
  
  onInputBlur() {
    this.focusTrackingService.inputHasFocus = false;
  }
              
  onSubmitLogin() {
    this.loginUser();
  }

  onSubmitSignUp() {
    this.signUser();
  }

  desabilitar() {
    setTimeout(() => {
      this.btnDis = true;
    }, 500);
  }

  toggleLogin() {
    this.isLoginActive = !this.isLoginActive;
    this.isSignUpActive = false;
  }

  toggleSignUp() {
    this.isSignUpActive = !this.isSignUpActive;
    this.isLoginActive = false;
  }
  
  modelLogin:any = [];
  response:any=[];
  loginUser() {

    this.modelLogin = {
      "email":    this.loginForm.controls['email'].value,
      "password": this.loginForm.controls['password'].value,
    }

    console.warn(this.modelLogin)

    this.login.logUser( this.modelLogin ).subscribe({

      next: (x) => {
        console.log('RESPUESTA OK');
        console.log(x);
        this.response = x;
      }, error: (e) => {
        console.error(e);
        this.response = e;
      },complete: ()=>{
        const cryptCuser: any = this.ncrypt.encryptWithAsciiSeed( this.response.coduser, this.env.seed, this.env.hashlvl );
        const cryptemail: any = this.ncrypt.encryptWithAsciiSeed(this.response.email, this.env.seed, this.env.hashlvl)
        const cryptname: any = this.ncrypt.encryptWithAsciiSeed(this.response.nombre, this.env.seed, this.env.hashlvl)
        sessionStorage.setItem('c_c_r_u', cryptCuser);
        sessionStorage.setItem('c_e_r_m',   cryptemail);
        sessionStorage.setItem('c_n_r_a',  cryptname);
        this.route.navigate(['dashboard']);
      }

    })
  }


  encontrarMiIp() {
    this.ipService.getPublicIp().subscribe({
      next: (x:any) => {
        this.publicIpAddress = x.ip;
      }, error: (e) => {
        console.error(e);
      }
    })
  }
  
  token:any
  signUser() {

    let date = new Date();
    let dia: any = date.getDay();
    let mes: any = date.getMonth();
    let anio: any = date.getFullYear();
    this.token = 'US-'+this.generarTOKEN()+dia+mes+anio;

    this.modelUser = {
      Nombre: this.signForm.controls['nombre'].value,
      Email : this.signForm.controls['email'].value,
      Password: this.signForm.controls['password'].value,
      Coduser : this.token,
      Descripcion : '',
      Estadoconexion: 1
    }

    console.warn(this.modelUser);

    this.login.guardarUsuario(this.modelUser).subscribe({
      next: (x) => {
        Swal.fire(
          '¿En hora buena?',
          'Haz creado tu cuenta exitósamente',
          'success'
        )
      }, error: (e) => {
        Swal.fire(
          'Oops Algo ha ocurrido!',
          'Intenalo de nuevo más tarde',
          'error'
        )
      }, complete: () => {
            this.encontrarMiIp();
            // console.error(777);
            this.login.crearCuenta(this.token, '--', '001').subscribe({
              next: (x) => {
                console.warn('Modulos creados');
              },error: (e) => {
                console.error(e);
              }, complete: () => {
                let arr: any = [];
                arr = {
                  "coduser":     this.token,
                  "city":        this.modelUbicacion.city,
                  "country":     this.modelUbicacion.country,
                  "countryCode": this.modelUbicacion.countryCode,
                  "isp":         this.modelUbicacion.isp,
                  "lat":         this.modelUbicacion.lat,
                  "lon":         this.modelUbicacion.lon,
                  "org":         this.modelUbicacion.org,
                  "query":       this.publicIpAddress,
                  "region":      this.modelUbicacion.region,
                  "regionName":  this.modelUbicacion.regionName,
                  "status":      this.modelUbicacion.status,
                  "timezone":    this.modelUbicacion.timezone,
                  "zip":         this.modelUbicacion.zip,
                }
              
                this.login.guardarUbicacion(arr).subscribe({
                  next: (x) => { 
                    // console.warn('Ubicaicon por Ip guardada')
                  }, error: (e) => {
                    console.error(e);
                  }, complete: () => {
                    this.guardarPerfil();
                  }
                })
              }
            })
            // console.error(778);
        this._signUp = false;
        this._login = true;
        this.loginForm.controls['email'].setValue(this.signForm.controls['email'].value);
        this.loginForm.controls['password'].setValue(this.signForm.controls['password'].value);
      }
    })

  }

  
  modelPerfil:any = [];
  guardarPerfil() {

    this.modelPerfil = {
      "nombre": "",
      "apellido": "",
      "observacion": "",
      "email": this.signForm.controls['email'].value,
      "alias": this.signForm.controls['nombre'].value,
      "codpais": "",
      "codprov": "",
      "coduser": this.token,
      "fotoperfilA": "",
      "fotoperfilB": "",
      "fotoperfilC": "",
      "celular": "",
      "edad": 0,
      "ciudad": ""
    }

    this.login.guardarPerfil(this.modelPerfil).subscribe({
      next: () => {
        console.warn('GUARDADO EN EL PERFIL');
      }, error: (e) => {
        console.error(e);
      }
    })
  }

  tokeng:any;
  generarTOKEN(): string {
    this.tokeng = this.dash.generateRandomString(15);
    return this.tokeng;
  }


  passwordMatchValidator() {
    const password = this.signForm.controls['password'].value;
    const repassword = this.signForm.controls['repassword'].value;
    if (password === repassword) {
      this.btnDis = false;
    } else {
      this.btnDis = true;
    }
  }


}
