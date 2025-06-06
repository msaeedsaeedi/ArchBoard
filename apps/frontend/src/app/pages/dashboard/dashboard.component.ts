import { Component, inject, model, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { CreateBoardComponent } from '../../components/create-board/create-board.component';
import { BoardListComponent } from '../../components/board-list/board-list.component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [
    ButtonModule,
    CreateBoardComponent,
    BoardListComponent,
    InputTextModule,
    FloatLabelModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  authService = inject(AuthService);
  visible = signal<boolean>(false);
  searchTerm = model('');

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('p-dark');
  }

  logout() {
    this.authService.logout();
  }
}
