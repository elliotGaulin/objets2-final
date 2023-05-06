import { Test, TestingModule } from '@nestjs/testing';
import { IntrusionController } from './intrusion.controller';

describe('IntrusionController', () => {
  let controller: IntrusionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntrusionController],
    }).compile();

    controller = module.get<IntrusionController>(IntrusionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
