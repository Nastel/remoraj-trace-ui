import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoraComponent } from './remora.component';

describe('RemoraComponent', () => {
  let component: RemoraComponent;
  let fixture: ComponentFixture<RemoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
