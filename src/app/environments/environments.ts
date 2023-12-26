import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class Environments implements OnInit {
    
    public version: string = 'V 1.1.2'
    readonly seed: number = 10;
    readonly hashlvl: number = 20; 

    public temasPrincipalApp: any = [
        {   
            "name_theme":          "theme_app_1",
            "color_fondo":         "background: #454440 ;",
            "color_texto":         "#F0F0F0",
            "color_box":           "background: #505050;",
            "color_box_border":    "#E5C180",
            "color_mini_buttons":  "rgba(207, 89, 39, 0.8)",
            "color_button_border": "#66635C",
            "color_button_bg":     "#505050",
            "color_button_texto":  "#E4F2F4",
            "color_shadows":       "0px 7px 15px rgba(0, 0, 0, 0.5)"
        }
    ]

    constructor( private http: HttpClient ) {}
    private apiUrl: any = 'http://localhost:9080/'
    // private apiUrl: any = 'https://08549b20f27b.ngrok.app/';

    ngOnInit() {
        this.obtenerApiDB();
    }

    obtenerApiDB() {

        this.http.get('https://08549b20f27b.ngrok.app/api/ApiSystems/obtenerPrefix').subscribe( {
            next:( api ) => {
                console.log(api);
            }
        } )

    }

    apiurl():string {
        const env:string = this.apiUrl+'api/';
        return env;
    }

    apiUrlStorage(): string {
        const envstorage:string = this.apiUrl+'storage/';
        return envstorage;
    }
    
    apiUrlStoragePerfil(): string {
        const envstorage:string = this.apiUrl+'perfil/';
        return envstorage;
    }

    apiUrlHub(): string {
        const envHub: string = this.apiUrl+'hubs/';
        return envHub;
    }

}


