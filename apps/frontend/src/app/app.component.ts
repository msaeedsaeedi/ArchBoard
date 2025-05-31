import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from "primeng/toast"

@Component({
  selector: 'app-root',
  imports: [RouterModule, ToastModule],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
