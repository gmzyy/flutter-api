import { Injectable } from '@nestjs/common';
import { Rol } from './rol.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRolDto } from './dto/create-rol.dto';

@Injectable()
export class RolesService {
    constructor(@InjectRepository(Rol) private rolesRepository:
    Repository<Rol>){

    }
//Aqui estamos creando y almacenando un nuevo rol en la BD
    create(rol:CreateRolDto){
        const newRol=this.rolesRepository.create(rol);
        return this.rolesRepository.save(newRol)
    }
   
}