import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-images-grid',
  templateUrl: './images-grid.component.html',
  styleUrls: ['./images-grid.component.scss'],
})
export class ImagesGridComponent implements OnInit {
  constructor() {}

  @Input() images!: string[];

  classes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

  ngOnInit(): void {}
}
