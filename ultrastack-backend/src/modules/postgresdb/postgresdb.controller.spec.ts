import { Test, TestingModule } from '@nestjs/testing';
import { PostgresdbController } from './postgresdb.controller';
import { PostgresdbService } from './postgresdb.service';

describe('PostgresdbController', () => {
  let controller: PostgresdbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostgresdbController],
      providers: [PostgresdbService],
    }).compile();

    controller = module.get<PostgresdbController>(PostgresdbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
