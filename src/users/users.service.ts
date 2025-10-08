import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-users.dto';
import { Rol } from 'src/roles/rol.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    // Validación de correo existente
    const emailExists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (emailExists) {
      throw new BadRequestException('El correo ya está registrado');
    }
    
    // Buscar roles por ID
    const roles = await this.rolRepo.findByIds(dto.roles);
    if (roles.length !== dto.roles.length) {
      throw new BadRequestException('Uno o más roles no existen');
    }

    // Validación de teléfono existente
    const phoneExists = await this.userRepo.findOne({ where: { phone: dto.phone } });
    if (phoneExists) {
      throw new BadRequestException('El teléfono ya está registrado');
    }

    const user = this.userRepo.create({...dto, roles});
    return this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async update(id: number, data: Partial<User | { roles?: string[] }>): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // Si se envían roles como string[], buscar los roles en la base de datos
    if (data.roles && Array.isArray(data.roles) && typeof data.roles[0] === 'string') {
      const roles = await this.rolRepo.findByIds(data.roles as string[]);
      if (roles.length !== data.roles.length) {
        throw new BadRequestException('Uno o más roles no existen');
      }
      user.roles = roles;
      delete data.roles;
    }

    Object.assign(user, data);
    return this.userRepo.save(user);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return { message: `User ${id} deleted` };
  }

  // ✅ Agrega este método para AuthService
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }
}
