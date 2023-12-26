import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpService {

  constructor( private http: HttpClient ) { }

  getPublicIp() {
    return this.http.get('https://api.ipify.org?format=json');
  }

  // getIpInfo(ip: string) {
  //   return axios.get(`http://ip-api.com/json/${ip}`)
  //     .then(response => response.data)
  //     .catch(error => {
  //       console.error('Error obteniendo información de geolocalización:', error);
  //       return null;
  //     });
  // }

}
