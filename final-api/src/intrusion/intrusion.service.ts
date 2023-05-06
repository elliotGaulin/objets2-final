import { Injectable } from '@nestjs/common';
import { Intrusion } from './Entity/intrusion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * Service de gestion des intrusions
 */
@Injectable()
export class IntrusionService {
    constructor(
        @InjectRepository(Intrusion)
        private readonly intrusionRepository: Repository<Intrusion>,
    ) { }

    /**
     * Trouve toutes les intrusions en ordre de date décroissante
     * @returns Toutes les intrusions en ordre de date décroissante
     */
    async findAll(): Promise<Intrusion[]> {
        return await this.intrusionRepository.find({
            order: {
                date: "DESC"
            }
        });
    }

    /**
     * Insère une intrusion
     * @param intrusion
     * @returns
     */
    async create(): Promise<Intrusion> {
        return this.intrusionRepository.save({});
    }
}
