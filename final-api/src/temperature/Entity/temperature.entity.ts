import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Temperature {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    temperature: number;

    @Column()
    humidity: number;

    @Column({
        default: () => "CURRENT_TIMESTAMP"
    })
    date: Date;
}