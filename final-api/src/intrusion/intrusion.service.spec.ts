import { Test, TestingModule } from '@nestjs/testing';
import { IntrusionService } from './intrusion.service';

describe('IntrusionService', () => {
  let service: IntrusionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntrusionService],
    }).compile();

    service = module.get<IntrusionService>(IntrusionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
