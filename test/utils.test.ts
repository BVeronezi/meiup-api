import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Usuario } from '../src/modules/usuario/usuario.entity';
import { ConfigE2eModule } from './modules/config-e2e.module';
import { DbE2eModule } from './modules/db-e2e.module';

export async function getTestingModule(
  modules: any[],
  providers: Provider[] = [],
): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [DbE2eModule, ConfigE2eModule, ...modules],
    providers,
  }).compile();
}
