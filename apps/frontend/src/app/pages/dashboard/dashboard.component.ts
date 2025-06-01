import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { DrawerModule } from 'primeng/drawer';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { BoardService } from '../../services/board.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    ButtonModule,
    DrawerModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './dashboard.component.html',
  providers: [BoardService],
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  authService = inject(AuthService);
  boardService = inject(BoardService);
  router = inject(Router);
  toast = inject(ToastService);
  visible = signal<boolean>(false);

  createBoardForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: Validators.required }),
    description: new FormControl(''),
  });

  createBoard() {
    this.boardService
      .create(
        this.createBoardForm.controls.title.value,
        this.createBoardForm.controls.description.value,
      )
      .subscribe({
        next: (slug) => {
          this.toast.success('Board', 'Successfully Created Board');
          this.router.navigate([`/board/${slug}`]);
        },
        error: (error: Error) => {
          this.toast.error('Board', error.message);
        },
      });
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('p-dark');
  }

  logout() {
    this.authService.logout();
  }
}
