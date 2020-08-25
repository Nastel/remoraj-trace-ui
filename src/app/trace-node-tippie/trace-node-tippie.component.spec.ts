import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceNodeTippieComponent } from './trace-node-tippie.component';

describe('TraceNodeTippieComponent', () => {
  let component: TraceNodeTippieComponent;
  let fixture: ComponentFixture<TraceNodeTippieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceNodeTippieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceNodeTippieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
