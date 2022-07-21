import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { msg: string },
    private router: Router
  ) {}

  ngOnInit(): void {}
  onLogin() {
    this.router.navigate(['login']);
    this.dialogRef.close();
  }
  onRegister() {
    this.router.navigate(['register']);
    this.dialogRef.close();
  }
}
