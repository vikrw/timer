import { TestBed } from '@angular/core/testing';

import { Deadline } from './deadline';

describe('Deadline', () => {
  let service: Deadline;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Deadline);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
