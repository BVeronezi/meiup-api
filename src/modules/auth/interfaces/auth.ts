import { TipoUsuario } from 'src/modules/usuario/enum/user-roles.enum';

export interface ITokenUser {
  id: number;
  email: string;
  roles: TipoUsuario[];
}
