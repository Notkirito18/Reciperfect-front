import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rate-dialog',
  templateUrl: './rate-dialog.component.html',
  styleUrls: ['./rate-dialog.component.scss'],
})
export class RateDialogComponent implements OnInit {
  hoverRating!: number;
  rating!: number;

  constructor(
    public dialogRef: MatDialogRef<RateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rated: boolean; rating: number }
  ) {}
  ngOnInit(): void {
    if (this.data.rated) {
      this.rating = this.data.rating;
    }
  }

  rateSelected(rate: number) {
    this.rating = rate;
  }
}
