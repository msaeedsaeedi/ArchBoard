import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-board',
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  tmp = signal<string>('Hello World');
}
