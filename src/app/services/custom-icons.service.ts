import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class CustomIconsService {
  constructor(
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {
    this.matIconRegistry.addSvgIcon(
      `facebook`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/facebook.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `instagram`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/instagram.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      `pinterest`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/pinterest.svg'
      )
    );
  }
}
