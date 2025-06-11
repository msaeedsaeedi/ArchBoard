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
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { BoardCollaboratorsDialogComponent } from '../board-collaborators-dialog/board-collaborators-dialog.component';

interface BoardFormValue {
  id: number | null;
  title: string;
  description?: string;
}

@Component({
  selector: 'app-board-list',
  imports: [
    RouterModule,
    SkeletonModule,
    ConfirmDialog,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FloatLabelModule,
    TextareaModule,
    ReactiveFormsModule,
  ],
  providers: [ConfirmationService, DialogService],
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.css',
})
export class BoardListComponent implements OnInit {
  // Required Services
  boardService = inject(BoardService);
  injector = inject(Injector);
  toast = inject(ToastService);

  // Filtering Search Term
  searchTerm = input('');

  // Global Card Loading
  loading = signal<boolean>(true);

  // Edit States
  editSaveLoading = signal<boolean>(false);
  IsEditDialogVisible = signal<boolean>(false);
  EditForm = new FormGroup({
    id: new FormControl<number | null>(null), // Hidden Field
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
  });

  // Board Data
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

  handleEditStart(board: Board) {
    this.EditForm.controls.id.setValue(board.id);
    this.EditForm.controls.title.setValue(board.title);
    this.EditForm.controls.description.setValue(board.description || null);
    this.IsEditDialogVisible.set(true);
  }

  handleEditSave() {
    const formValue = this.EditForm.value as BoardFormValue;

    if (formValue.id === null) {
      this.toast.error('Internal Error', 'Something went wrong. Please try again later');
      return;
    }

    this.editSaveLoading.set(true);
    this.boardService.update(formValue.id, formValue.title, formValue.description).subscribe({
      next: () => {
        // Update Local State
        this.boards.update((prev) =>
          prev.map((board) =>
            board.id === formValue.id
              ? { ...board, title: formValue.title, description: formValue.description }
              : board,
          ),
        );

        this.toast.success('Board', 'Successfully Updated Board Details');
        this.editSaveLoading.set(false);
        this.IsEditDialogVisible.set(false);
        this.EditForm.reset({ id: null, title: '', description: undefined });
      },
      error: (error: Error) => {
        this.toast.error('Error', error.message);
        this.editSaveLoading.set(false);
      },
    });
  }

  handleEditDiscard() {
    this.IsEditDialogVisible.set(false);
    this.EditForm.reset({ id: null, title: '', description: undefined });
  }

  async showCollaboratorsDialog(boardId: number) {
    const dialogServiceModule = await import('primeng/dynamicdialog');
    const dialogService = this.injector.get(dialogServiceModule.DialogService);

    dialogService.open(BoardCollaboratorsDialogComponent, {
      header: 'Edit Collaborators',
      inputValues: {
        id: boardId,
      },
      focusOnShow: false,
      modal: true,
      closable: true,
      width: '45dvw',
    });
  }
}
