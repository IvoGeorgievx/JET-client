import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeFlowComponent } from './welcome-flow.component';

describe('WelcomeFlowComponent', () => {
  let component: WelcomeFlowComponent;
  let fixture: ComponentFixture<WelcomeFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
