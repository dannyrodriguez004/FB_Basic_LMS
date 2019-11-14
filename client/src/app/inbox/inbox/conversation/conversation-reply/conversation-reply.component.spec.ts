import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationReplyComponent } from './conversation-reply.component';

describe('ConversationReplyComponent', () => {
  let component: ConversationReplyComponent;
  let fixture: ComponentFixture<ConversationReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
