import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalsService {
  constructor() {}

  notification = new Subject<{ msg: string; type: 'error' | 'notError' }>();
  headerTransparency = new Subject<boolean>();
}
