import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './rol.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Rol,User])],
  //sirve para especificar con que tablas vamos a estar trabajando
  //Rol= es nuestro modelo de datos
  providers: [RolesService],
  controllers: [RolesController]
})
export class RolesModule {}