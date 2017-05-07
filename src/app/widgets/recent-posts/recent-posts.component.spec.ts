import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentPostsComponent } from './recent-posts.component';

describe('RecentPostsComponent', () => {
  let component: RecentPostsComponent;
  let fixture: ComponentFixture<RecentPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
