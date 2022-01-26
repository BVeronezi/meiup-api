import { ConfigModule } from '@nestjs/config';
import database from './src/config/database.config';

ConfigModule.forRoot({
  isGlobal: true,
  load: [database],
});

export default database();
