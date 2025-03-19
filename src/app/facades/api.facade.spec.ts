import { TestBed } from '@angular/core/testing';

import { ApiFacade } from './api.facade';

describe('ApiFacade', () => {
  let service: ApiFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
