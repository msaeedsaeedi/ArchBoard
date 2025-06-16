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
import { BoardService } from '@services/board.service';
import { finalize } from 'rxjs';
import { ToastService } from '@services/toast.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Collaborator } from '@app-types/collaborator';
import { SkeletonModule } from 'primeng/skeleton';
import { CollaboratorRole } from '@enums/CollaboratorRole';
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

  private addCollaboratorRoleControl(collaborator: Collaborator) {
    const rowControl = this.formBuilder.control(collaborator.role) as FormControl;
    this.rows.push(rowControl);

    rowControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      // TODO Call API HERE
    });
  }

  loadCollaborators(event: TableLazyLoadEvent) {
    this.boardService.getCollaborators(this.id()).subscribe({
      next: (value) => {
        this.collaborators.set(value);
        if (event.forceUpdate) event.forceUpdate();

        // Add role value subscription
        this.rows.clear();
        value.forEach((row) => {
          this.addCollaboratorRoleControl(row);
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
          const collaborator = { email: collaboratorEmail, role: collaboratorRole };
          this.collaborators.update((prev) => [...prev, collaborator]);
          this.addCollaboratorRoleControl(collaborator);

          this.toast.success(
            'Board Collaborators',
            `Successfully Added ${collaboratorEmail} as Board Collaborator`,
          );
        },
        error: (error: Error) => {
          this.toast.error('Error', error.message);
        },
      });
  }

  handleCollaboratorRemove(collaboratorEmail: string) {
    this.boardService
      .removeCollaborator(this.id(), collaboratorEmail)
      .pipe()
      .subscribe({
        next: () => {
          this.collaborators.update((pre) => pre.filter((val) => val.email !== collaboratorEmail));
          this.toast.success(
            'Success',
            `Successfully Removed ${collaboratorEmail} from collaborators`,
          );
        },
        error: (e: Error) => {
          this.toast.error('Error', e.message);
        },
      });
  }
}
