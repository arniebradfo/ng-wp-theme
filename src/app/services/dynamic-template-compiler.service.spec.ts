import { TestBed, inject } from '@angular/core/testing';

import { DynamicTemplateCompilerService } from './dynamic-template-compiler.service';

describe('DynamicTemplateCompilerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicTemplateCompilerService]
    });
  });

  it('should ...', inject([DynamicTemplateCompilerService], (service: DynamicTemplateCompilerService) => {
    expect(service).toBeTruthy();
  }));
});
