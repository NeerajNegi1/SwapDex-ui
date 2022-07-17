import { TestBed } from '@angular/core/testing';

import { SnackbarToggleService } from './snackbar-toggle.service';

describe('SnackbarToggleService', () => {
  let service: SnackbarToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackbarToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
