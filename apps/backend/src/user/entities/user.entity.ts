import KSUID from 'ksuid';
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', unique: true })
    ksuid: string = KSUID.randomSync().toJSON();

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false, unique: true })
    phone: string;

    @Column({ nullable: true })
    first_name: string;

    @Column({ nullable: true })
    last_name: string;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: false })
    is_enabled: boolean;

    @Column({ nullable: false })
    is_verified: boolean;

    @Column({ nullable: false })
    verified_at: boolean;

    @Column({ nullable: false })
    is_deleted: boolean;

    @Column({ nullable: false })
    is_blocked: boolean;

    @Column({ nullable: true })
    password: string;

    @Column({ name: 'createdAt' })
    createdAt: Date = new Date();

    @UpdateDateColumn({ name: 'updatedAt' })
    updatedAt: Date;
}
