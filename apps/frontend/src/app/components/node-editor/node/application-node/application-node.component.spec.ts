import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationNodeComponent } from './application-node.component';

describe('ApplicationNodeComponent', () => {
  let component: ApplicationNodeComponent;
  let fixture: ComponentFixture<ApplicationNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationNodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
