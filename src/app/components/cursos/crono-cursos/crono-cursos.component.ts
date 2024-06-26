import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Environments } from 'src/app/environments/environments';
import { EncryptService } from 'src/app/shared/services/encrypt.service';
import { CursosService } from '../instituciones/modal-cursos/services/cursos.service';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

@Component({
  selector: 'app-crono-cursos',
  templateUrl: './crono-cursos.component.html',
  styleUrls: ['./crono-cursos.component.scss']
})
export class CronoCursosComponent implements OnInit {

  mes: number = 0;
  anio: number = 0;
  dias: Array<{ num: number, nombre: string, cursos: any[] }> = [];
  meses: Array<{ value: number, name: string }> = [];
  anios: number[] = [];

  mesActual: number = new Date().getMonth() + 1;
  mesSeleccionadoControl: FormControl = new FormControl(this.mesActual);
  cursoSeleccionadoControl: FormControl = new FormControl();

  _show_spinner: boolean = false;
  decrypt: any;

  listaDeCursos: any = [];
  listaDeCursosGhost: any = [];

  constructor(private env: Environments, private ncrypt: EncryptService, private curso: CursosService) { }

  ngOnInit(): void {
    const xuser: any = sessionStorage.getItem('c_c_r_u');
    this.decrypt = this.ncrypt.decryptWithAsciiSeed(xuser, this.env.seed, this.env.hashlvl);
    this.obtenerCursos();
    this.inicializarMeses();
    this.inicializarAnios();
    const fechaActual = new Date();
    this.mes = fechaActual.getMonth() + 1; // Enero es 0
    this.anio = fechaActual.getFullYear();
    this.crearCalendario();
  }

  inicializarMeses() {
    this.meses = [
      { value: 1, name: 'Enero' },
      { value: 2, name: 'Febrero' },
      { value: 3, name: 'Marzo' },
      { value: 4, name: 'Abril' },
      { value: 5, name: 'Mayo' },
      { value: 6, name: 'Junio' },
      { value: 7, name: 'Julio' },
      { value: 8, name: 'Agosto' },
      { value: 9, name: 'Septiembre' },
      { value: 10, name: 'Octubre' },
      { value: 11, name: 'Noviembre' },
      { value: 12, name: 'Diciembre' }
    ];
  }

  inicializarAnios() {
    const anioActual = new Date().getFullYear();
    for (let i = anioActual - 10; i <= anioActual + 10; i++) {
      this.anios.push(i);
    }
  }

  crearCalendario() {
    const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const fecha = new Date(this.anio, this.mes - 1, 1);
    this.dias = [];

    while (fecha.getMonth() === this.mes - 1) {
      this.dias.push({
        num: fecha.getDate(),
        nombre: nombresDias[fecha.getDay()],
        cursos: [] // Inicializamos el array de cursos
      });
      fecha.setDate(fecha.getDate() + 1);
    }

    // Asignar cursos a los días correspondientes
    this.listaDeCursosGhost.forEach((curso:any) => {
      const fechaInicio = new Date(curso.fechaini);
      const fechaFin = new Date(curso.fechafin);

      for (let d = new Date(fechaInicio); d <= fechaFin; d.setDate(d.getDate() + 1)) {
        if (d.getMonth() + 1 === this.mes && d.getFullYear() === this.anio) {
          const diaIndex = d.getDate() - 1;
          if (this.dias[diaIndex]) {
            this.dias[diaIndex].cursos.push(curso);
          }
        }
      }
    });
  }

  colorCurso: string="#A5F4DA";
  obtenerCursos() {
    this._show_spinner = true;
    this.curso.obtenerCursos(this.decrypt, 0).subscribe(
      {
        next: (x) => {
          this.listaDeCursos = x;
          this.listaDeCursosGhost = x;
          this.crearCalendario(); // Volver a crear el calendario una vez obtenidos los cursos
        }, complete: () => {
          this._show_spinner = false;
          this.listaDeCursos.forEach((element: any) => {
            element.color = this.colorCurso;
            if (element.tipo == 1) element.modalidad = 'Online';
            else if (element.tipo == 2) element.modalidad = 'Presencial';
            else if (element.tipo == 3) element.modalidad = 'Semi Presencial';
          });

          console.log('this.listaDeCursos');
          console.log(this.listaDeCursos);

        }, error: (e) => {
          this._show_spinner = false;
          console.error(e);
        }
      }
    );
  }

  onMesChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.mes = +selectElement.value;
    this.crearCalendario();
  }

  onAnioChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.anio = +selectElement.value;
    this.crearCalendario();
  }

}
