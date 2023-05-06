import { DataGrid } from "@mui/x-data-grid";
import Temperature from "../Entities/temperature.entity";

const columns = [
    { field: "temperature", headerName: "Température", flex: 1 },
    { field: "humidity", headerName: "Humidité", flex: 1 },
    { field: "date", headerName: "Date", flex: 2, valueFormatter: (params: any) => new Date(params.value).toLocaleString() },
];
export default function TemperatureList(props: { temperatures: Temperature[] }) {
    return (<DataGrid rows={props.temperatures} columns={columns} disableRowSelectionOnClick />);
}
