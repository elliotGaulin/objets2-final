import { DataGrid, frFR } from "@mui/x-data-grid";
import Intrusion from "../Entities/intrusion.entity";

const columns = [
    { field: "date", headerName: "Date", flex: 1, valueFormatter: (params: any) => new Date(params.value).toLocaleString() },
];

export default function IntrusionList(props: { intrusions: Intrusion[] }) {
    if (props.intrusions.length === 0) return (<h2>Aucune intrusion enregistrée</h2>);
    return (<DataGrid rows={props.intrusions} columns={columns} disableRowSelectionOnClick />);
}
