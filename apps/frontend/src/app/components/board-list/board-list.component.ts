import { Component, inject, OnInit, signal, PLATFORM_ID, input, computed } from '@angular/core';
import { makeStateKey, TransferState, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { BoardService } from '../../services/board.service';
import { Board } from '../../types/board';
import { finalize } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { isPlatformBrowser } from '@angular/common';

// Define a state key for the boards
const BOARDS_KEY = makeStateKey<Board[]>('boards');

@Component({
  selector: 'app-board-list',
  imports: [RouterModule, SkeletonModule],
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.css',
})
export class BoardListComponent implements OnInit {
  boardService = inject(BoardService);
  toast = inject(ToastService);
  platformId = inject(PLATFORM_ID);
  transferState = inject(TransferState);

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
    // Check if boards are already in TransferState (client-side reuse)
    const cachedBoards = this.transferState.get(BOARDS_KEY, null);
    if (cachedBoards) {
      this.boards.set(cachedBoards);
      this.loading.set(false);
      return;
    }

    // Fetch boards (only in browser or server during SSR)
    this.boardService
      .get()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.boards.set(response);
          // Store in TransferState for client-side reuse
          if (!isPlatformBrowser(this.platformId)) {
            this.transferState.set(BOARDS_KEY, response);
          }
        },
        error: (error: Error) => {
          if (isPlatformBrowser(this.platformId)) {
            this.toast.error('Error', error.message);
          }
        },
      });
  }
}
