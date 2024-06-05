import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EstudiantesComponent } from './components/cursos/estudiantes/estudiantes.component';

const routes: Routes = [
  { path: 'login',     component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'formularioIngreso', component: EstudiantesComponent },
  { path: '**',      pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
