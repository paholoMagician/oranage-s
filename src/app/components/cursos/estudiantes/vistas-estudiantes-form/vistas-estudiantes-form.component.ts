import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vistas-estudiantes-form',
  templateUrl: './vistas-estudiantes-form.component.html',
  styleUrls: ['./vistas-estudiantes-form.component.scss']
})
export class VistasEstudiantesFormComponent implements OnInit {

  vista_register_on: boolean = true;

  param1: any;
  param2: any;

  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    // this.param1 = this.route.snapshot.paramMap.get('param1');
    // this.param2 = this.route.snapshot.paramMap.get('param2');
    // // Ahora puedes usar param1 y param2 según sea necesario
    // console.log(this.param1)
    // console.log(this.param2)
  }
}
