import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPosts } from './info-posts';

describe('InfoPosts', () => {
  let component: InfoPosts;
  let fixture: ComponentFixture<InfoPosts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoPosts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPosts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
