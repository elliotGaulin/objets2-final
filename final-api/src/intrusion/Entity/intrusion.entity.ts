import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Intrusion {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        default: () => "CURRENT_TIMESTAMP"
    })
    date: Date;
}