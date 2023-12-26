import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environments } from 'src/app/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  
  constructor(private http: HttpClient, private env: Environments) { }
  
  private baseUrl = this.env.apiurl()+'storage';
  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
    
  }
  uploadFilePerfil(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/uploadPerfil`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
    
  }
  uploadInstituto(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/uploadInstituto`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
    
  }


}
