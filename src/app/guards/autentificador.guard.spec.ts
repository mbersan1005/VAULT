import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { autentificadorGuard } from './autentificador.guard';

describe('autentificadorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => autentificadorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
