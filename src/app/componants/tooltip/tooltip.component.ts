import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnInit {
  constructor() {}
  @Input() message!: string;
  ngOnInit(): void {}
}
