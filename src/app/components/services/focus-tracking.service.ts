import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FocusTrackingService {

  inputHasFocus: boolean = false;

  constructor() { }


}
