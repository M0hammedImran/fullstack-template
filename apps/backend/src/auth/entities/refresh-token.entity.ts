import KSUID from 'ksuid';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        unique: true,
    })
    ksuid: string = KSUID.randomSync().toJSON();

    @Column({ nullable: false, unique: true })
    user_ksuid: string;

    @Column({ nullable: false, unique: true })
    refresh_token: string;

    @Column({ name: 'createdAt' })
    createdAt: Date = new Date();
}
