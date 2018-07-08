import { TestBed, inject } from '@angular/core/testing';

import { HelpModalService } from './help-modal.service';

describe('HelpModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HelpModalService]
    });
  });

  it('should be created', inject([HelpModalService], (service: HelpModalService) => {
    expect(service).toBeTruthy();
  }));
});
