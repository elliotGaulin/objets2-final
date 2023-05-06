import { Controller, Get, Post } from '@nestjs/common';
import { IntrusionService } from './intrusion.service';
import { Intrusion } from './Entity/intrusion.entity';

/**
 * Controller de gestion des intrusions
 */
@Controller('intrusion')
export class IntrusionController {
    constructor(
        private readonly intrusionService: IntrusionService,
    ) { }

    /**
     * Trouve toutes les intrusions en ordre de date décroissante
     */
    @Get()
    async getIntrusions(): Promise<Intrusion[]> {
        return this.intrusionService.findAll();
    }

    /**
     * Insère une intrusion
     */
    @Post()
    async createIntrusion(): Promise<Intrusion> {
        return this.intrusionService.create();
    }
}