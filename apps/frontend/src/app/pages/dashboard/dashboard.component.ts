import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { CreateBoardComponent } from '../../components/create-board/create-board.component';

@Component({
  selector: 'app-dashboard',
  imports: [ButtonModule, CreateBoardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  authService = inject(AuthService);
  visible = signal<boolean>(false);

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('p-dark');
  }

  logout() {
    this.authService.logout();
  }
}
