import { TestBed } from '@angular/core/testing';

import { DeadlineService } from './deadline.service';

describe('Deadline Service', () => {
  let service: DeadlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeadlineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
