import { Component, inject, OnInit, signal, input, computed, Injector } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { BoardService } from '../../services/board.service';
import { Board } from '../../types/board';
import { delay, finalize } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-board-list',
  imports: [RouterModule, SkeletonModule, ConfirmDialog, ButtonModule],
  providers: [ConfirmationService],
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.css',
})
export class BoardListComponent implements OnInit {
  boardService = inject(BoardService);
  injector = inject(Injector);
  toast = inject(ToastService);

  searchTerm = input('');

  loading = signal<boolean>(true);

  boards = signal<Board[]>([]);
  filteredBoards = computed<Board[]>(() =>
    this.boards().filter(
      (board) =>
        board.title.includes(this.searchTerm()) || board.description?.includes(this.searchTerm()),
    ),
  );

  ngOnInit(): void {
    this.boardService
      .get()
      .pipe(
        delay(500),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.boards.set(response);
        },
        error: (error: Error) => {
          this.toast.error('Error', error.message);
        },
      });
  }

  async handleDelete(id: number, title: string) {
    const ApiModule = await import('primeng/api');
    const confirmationService = this.injector.get(ApiModule.ConfirmationService);
    confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.boardService.delete(id).subscribe({
          next: () => {
            this.boards.update((prev) => prev.filter((val) => val.id !== id));
            this.toast.success('Board', `Successfully Deleted ${title}`);
          },
          error: (error: Error) => {
            this.toast.error('Board', error.message);
          },
        });
      },
    });
  }
}
