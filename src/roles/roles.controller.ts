import { create } from 'domain';
import { RolesService } from './roles.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';

@Controller('roles')
export class RolesController {

    constructor(private RolesService:RolesService){}
   
    @Post()
    create(@Body() rol:CreateRolDto){
        return this.RolesService.create(rol);
    }

   
}