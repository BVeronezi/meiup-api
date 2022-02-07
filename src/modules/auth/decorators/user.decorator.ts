import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Usuario } from 'src/modules/usuario/usuario.entity';

export const User = createParamDecorator((data, req): Usuario => {
  const user = req.args[0].user;
  return user;
});
