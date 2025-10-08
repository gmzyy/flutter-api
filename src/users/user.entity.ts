// src/users/user.entity.ts
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcrypt';
import { Rol } from 'src/roles/rol.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50 })
  name: string;

  @Column({ nullable: false, length: 50 })
  lastname: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true, nullable: false })
  phone: string;

  // 🔸 Especifica type para evitar "Object"
  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string | null;

  @Column({ nullable: false })
  password: string;

  // 🔸 También aquí
  @Column({ type: 'varchar', length: 255, nullable: true })
  notification_token: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @JoinTable(
    {
      name : 'user_roles',
      joinColumn: { name: 'user_id' },
      inverseJoinColumn: { name: 'role_id' }
    }
  ) 
  @ManyToMany(() => Rol, (rol) => rol.users)
  roles: Rol[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, Number(process.env.HASH_SALT ?? 10));
  }
}
