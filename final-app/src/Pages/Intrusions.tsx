import { useEffect, useState } from "react"
import Temperature from "../Entities/temperature.entity"
import TemperatureService from "../Services/temperature.service"
import TemperatureList from "../Components/TemperatureList"
import { Box, Button } from "@mui/material"
import LightService from "../Services/light.service"
import IntrusionService from "../Services/intrusion.service"
import Intrusion from "../Entities/intrusion.entity"
import IntrusionList from "../Components/IntrusionList"

export default function Intrusions() {

    const [intrusions, setIntrusions] = useState<Intrusion[]>([]);

    useEffect(() => {
        IntrusionService.getAll().then((intrusions) => {
            setIntrusions(intrusions)
        });
    }, []);

    return (
        <Box sx={{ padding: "2em" }}>
            <h1>Intrusions</h1>
            <IntrusionList intrusions={intrusions} />
        </Box>
    );
}