import { createParamDecorator } from '@nestjs/common';
import { Usuario } from '../usuario/usuario.entity';

export const GetUser = createParamDecorator((data, req): Usuario => {
  const user = req.args[0].user;
  return user;
});
