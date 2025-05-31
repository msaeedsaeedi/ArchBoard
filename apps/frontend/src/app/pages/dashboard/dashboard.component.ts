import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-dashboard',
  imports: [ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  authService = inject(AuthService);
  toast = inject(ToastService);

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('p-dark');
  }

  logout() {
    this.authService.logout();
  }
}
