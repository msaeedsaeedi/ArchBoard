import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { BoardService } from '../../services/board.service';
import { Board } from '../../types/board';
import { finalize } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-board-list',
  imports: [RouterModule, SkeletonModule],
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.css',
})
export class BoardListComponent implements OnInit {
  boardService = inject(BoardService);
  toast = inject(ToastService);

  loading = signal<boolean>(true);
  boards = signal<Board[]>([]);

  ngOnInit(): void {
    this.boardService
      .get()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.boards.set(response);
        },
        error: (error: Error) => {
          this.toast.error('Error', error.message);
        },
      });
  }
}
