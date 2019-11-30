import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPopComponent } from './video-pop.component';

describe('VideoPopComponent', () => {
  let component: VideoPopComponent;
  let fixture: ComponentFixture<VideoPopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoPopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
