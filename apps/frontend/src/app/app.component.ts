import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast"
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, ToastModule],
  providers: [MessageService, ToastService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
