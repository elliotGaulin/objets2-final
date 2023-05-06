import { useEffect, useState } from "react"
import Temperature from "../Entities/temperature.entity"
import TemperatureService from "../Services/temperature.service"
import TemperatureList from "../Components/TemperatureList"
import { Box, Button } from "@mui/material"
import LightService from "../Services/light.service"

export default function Home() {

    const [temperatures, setTemperatures] = useState<Temperature[]>([]);

    useEffect(() => {
        TemperatureService.getAll().then((temperatures) => {
            setTemperatures(temperatures)
        });
    }, []);

    return (
        <Box sx={{ padding: "2em" }}>
            <h1>Accueil</h1>
            <Box sx={{ marginBottom: "1em" }}>

                <Button variant="contained" sx={{ marginRight: "1em" }} onClick={() => {
                    LightService.setLight(true);
                }}>Allumer la lumière</Button>

                <Button variant="contained" onClick={() => {
                    LightService.setLight(false);
                }}>Éteindre la lumière</Button>
            </Box>

            <TemperatureList temperatures={temperatures} />
        </Box >
    );
}