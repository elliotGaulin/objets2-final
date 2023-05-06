import { HttpService } from '@nestjs/axios';
import { Body, Controller, Param, Post } from '@nestjs/common';

/**
 * Controller de gestion de la lumière
 */
@Controller('light')
export class LightController {
    constructor(private readonly httpService: HttpService) { }

    /**
     * Effectue une requête au arduino pour allumer ou éteindre la lumière
     * @param body 
     * @returns 
     */
    @Post()
    async setLight(@Body() body: { on: boolean }): Promise<string> {
        //Call au arduino
        const url = "http://10.0.0.66/" + (body.on ? "on" : "off");
        const res = await this.httpService.get(url).subscribe((res) => {
            console.log(res.data);
        });
        return;
    }
}
