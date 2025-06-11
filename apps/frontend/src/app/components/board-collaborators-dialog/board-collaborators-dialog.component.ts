import { Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { BoardService } from '../../services/board.service';
import { finalize } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-board-collaborators-dialog',
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule, ButtonModule],
  templateUrl: './board-collaborators-dialog.component.html',
  styleUrl: './board-collaborators-dialog.component.css',
})
export class BoardCollaboratorsDialogComponent {
  id = input.required<number>();

  boardService = inject(BoardService);
  toast = inject(ToastService);
  ref = inject(DynamicDialogRef);

  addCollaboratorLoading = signal<boolean>(false);

  addCollaboratorForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  handleCollaboratorAdd() {
    const CollaboratorEmail = this.addCollaboratorForm.value.email;
    if (!CollaboratorEmail) return;
    this.addCollaboratorLoading.set(true);
    this.boardService
      .addCollaborator(this.id(), CollaboratorEmail)
      .pipe(finalize(() => this.addCollaboratorLoading.set(false)))
      .subscribe({
        next: () => {
          this.toast.success(
            'Board Collaborators',
            `Successfully Added ${CollaboratorEmail} as Board Collaborator`,
          );
          this.ref.close();
        },
        error: (error: Error) => {
          this.toast.error('Error', error.message);
        },
      });
  }
}
