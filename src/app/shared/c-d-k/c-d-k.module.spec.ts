import { CDKModule } from './c-d-k.module';

describe('CDKModule', () => {
  let cDKModule: CDKModule;

  beforeEach(() => {
    cDKModule = new CDKModule();
  });

  it('should create an instance', () => {
    expect(cDKModule).toBeTruthy();
  });
});
