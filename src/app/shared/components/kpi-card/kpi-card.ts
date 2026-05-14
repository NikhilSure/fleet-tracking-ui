import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  imports: [CommonModule],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss',
})
export class KpiCard {
  @Input()
  title!: string;

  @Input()
  value!: string | number;

  @Input()
  color: string =
    'primary';

  @Input()
  icon: string =
    'pi pi-chart-bar';
}
