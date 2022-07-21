import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyspaceComponent } from './myspace.component';

describe('MyspaceComponent', () => {
  let component: MyspaceComponent;
  let fixture: ComponentFixture<MyspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyspaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
