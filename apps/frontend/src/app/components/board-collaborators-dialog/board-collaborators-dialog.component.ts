import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { BoardService } from '../../services/board.service';
import { finalize } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Collaborator } from '../../types/collaborator';
import { SkeletonModule } from 'primeng/skeleton';
import { CollaboratorRole } from '../../enums/CollaboratorRole';
import { TitleCasePipe } from '@angular/common';
import { SelectModule } from 'primeng/select';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-board-collaborators-dialog',
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    SelectButtonModule,
    TableModule,
    SkeletonModule,
    SelectModule,
  ],
  providers: [TitleCasePipe],
  templateUrl: './board-collaborators-dialog.component.html',
  styleUrl: './board-collaborators-dialog.component.css',
})
export class BoardCollaboratorsDialogComponent {
  id = input.required<number>();

  boardService = inject(BoardService);
  toast = inject(ToastService);
  ref = inject(DynamicDialogRef);
  destroyRef = inject(DestroyRef);
  titleCasePipe = inject(TitleCasePipe);
  formBuilder = inject(FormBuilder);

  collaborators = signal<Collaborator[]>(Array.from({ length: 3 }));
  addCollaboratorLoading = signal<boolean>(false);

  cols: Column[] = [{ field: 'email', header: 'Email' }];
  roleOptions: { label: string; value: string }[] = Object.values(CollaboratorRole).map((value) => {
    return { value: value, label: this.titleCasePipe.transform(value) };
  });

  roleform: FormGroup = this.formBuilder.group({
    rows: this.formBuilder.array([]),
  });

  get rows(): FormArray<FormControl> {
    return this.roleform.get('rows') as FormArray<FormControl>;
  }

  addCollaboratorForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: Validators.required }),
    role: new FormControl(CollaboratorRole.VIEWER, {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  loadCollaborators(event: TableLazyLoadEvent) {
    this.boardService.getCollaborators(this.id()).subscribe({
      next: (value) => {
        this.collaborators.set(value);
        if (event.forceUpdate) event.forceUpdate();

        // Add role value subscription
        value.forEach((row) => {
          const rowControl = this.formBuilder.control(row.role) as FormControl;
          this.rows.push(rowControl);

          rowControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
            console.log('Updating: ', row.email, value); // CALL API HERE
          });
        });
      },
      error: (e: Error) => {
        this.toast.error('Error', e.message);
      },
    });
  }

  handleCollaboratorAdd() {
    const collaboratorEmail = this.addCollaboratorForm.value.email;
    const collaboratorRole = this.addCollaboratorForm.value.role;
    if (!collaboratorEmail) return;
    if (!collaboratorRole) return;
    this.addCollaboratorLoading.set(true);
    this.boardService
      .addCollaborator(this.id(), collaboratorEmail, collaboratorRole)
      .pipe(finalize(() => this.addCollaboratorLoading.set(false)))
      .subscribe({
        next: () => {
          this.toast.success(
            'Board Collaborators',
            `Successfully Added ${collaboratorEmail} as Board Collaborator`,
          );
          this.ref.close();
        },
        error: (error: Error) => {
          this.toast.error('Error', error.message);
        },
      });
  }
}
