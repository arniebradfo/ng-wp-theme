import { TestBed, inject } from '@angular/core/testing';

import { WpRestService } from './wp-rest.service';

describe('WpRestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WpRestService]
    });
  });

  it('should ...', inject([WpRestService], (service: WpRestService) => {
    expect(service).toBeTruthy();
  }));
});
