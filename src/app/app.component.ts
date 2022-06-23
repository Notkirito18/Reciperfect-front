import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalsService } from './services/globals.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private globals: GlobalsService,
    private snackBar: MatSnackBar
  ) {}
  notifier$!: Subscription;

  ngOnInit() {
    //auto login
    this.authService.autoLogin();
    //error notifier
    this.notifier$ = this.globals.notification.subscribe(({ msg, type }) => {
      if (msg.length > 1) {
        this.snackBar.open(msg, '', {
          duration: 4000,
          panelClass: type,
        });
      }
    });
  }
}
