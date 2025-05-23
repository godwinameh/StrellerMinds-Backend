// src/users/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProgress } from './user-progress.entity';
import { WalletInfo } from './wallet-info.entity'; // Ensure this import is present
import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/user-role.enum';
import { Role } from 'src/role/roles.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  isInstructor: boolean;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  // @Column({ nullable: true })
  // profilePicture: string;

  @Column({ type: 'enum', enum: Role, default: Role.STUDENT })
  role: Role;

  @Column({ nullable: true })
  profileImageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserProgress, (progress) => progress.user)
  progress: Promise<UserProgress[]>;

  @OneToOne(() => WalletInfo, (walletInfo) => walletInfo.user) // This defines the inverse relation
  walletInfo: WalletInfo;

  async setPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
