import { AppBar, Button, Switch, Toolbar, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import TemperatureService from "../Services/temperature.service";

export default function Navbar(props: { setTheme: (mode: 'light' | 'dark') => void }) {
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Objets connectés 2
                </Typography>
                <Switch defaultChecked onChange={(value) => {
                    value.target.checked ? props.setTheme('dark') : props.setTheme('light')
                }} />
                <Button color="inherit" onClick={() => navigate('/')}>Accueil</Button>
                <Button color="inherit" onClick={() => navigate('/intrusions')}>Intrusions</Button>
            </Toolbar>
        </AppBar>
    )
}