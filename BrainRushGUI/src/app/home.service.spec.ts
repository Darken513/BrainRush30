import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { HomeService } from './home.service';

describe('HomeService', () => {
  let service: HomeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        HttpClient,
        HttpHandler
      ],
    }).compileComponents();
    service = TestBed.inject(HomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
