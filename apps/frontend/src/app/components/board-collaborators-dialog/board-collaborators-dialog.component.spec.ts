import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardCollaboratorsDialogComponent } from './board-collaborators-dialog.component';

describe('BoardCollaboratorsDialogComponent', () => {
  let component: BoardCollaboratorsDialogComponent;
  let fixture: ComponentFixture<BoardCollaboratorsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardCollaboratorsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardCollaboratorsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
