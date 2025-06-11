import { Component, inject, Injector, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-create-board',
  imports: [
    ButtonModule,
    DrawerModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
  ],
  providers: [],
  templateUrl: './create-board.component.html',
  styleUrl: './create-board.component.css',
})
export class CreateBoardComponent {
  visible = signal<boolean>(false);

  injector = inject(Injector);
  // boardService = inject(BoardService);
  router = inject(Router);
  toast = inject(ToastService);

  createBoardForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: Validators.required }),
    description: new FormControl(''),
  });

  async createBoard() {
    const BoardServiceModule = await import('../../services/board.service');
    const boardService = this.injector.get(BoardServiceModule.BoardService);
    
    boardService
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
}
