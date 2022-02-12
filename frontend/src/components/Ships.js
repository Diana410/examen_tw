import { useState, useEffect } from 'react';
import { get, getQuery, remove } from '../Calls.js';
import { useNavigate } from 'react-router-dom';
import { routeGetShip, routeGetShipFilter, routeGetShipSortate, routeExportShipFull, routeDeleteShip } from '../ApiRoutes';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Grid, TextField, Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton } from "@material-ui/core";

export default function TabelShips() {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [needToUpdate, setNeedToUpdate] = useState(false)
    const [filtrare, setFiltrare] = useState({
        ShipNume: "",
        ShipDisplacement: ""
    })


    useEffect(async () => {
        let data = await get(routeGetShip);
        setRows(data);
    }, [needToUpdate]);
    useEffect(async () => {
        sessionStorage.clear();
    }, [])


    const onChangeFiltrare = e => {
        setFiltrare({ ...filtrare, [e.target.name]: e.target.value });
    }
    const filtrareShip = async () => {
        let data = await getQuery(routeGetShipFilter, filtrare.ShipNume, filtrare.ShipDisplacement);
        setRows(data);
    }
    const goToFormularModificareShip = (id) => {
        sessionStorage.setItem("putScreen", true);
        sessionStorage.setItem("idShip", id);
        navigate('/formularShip');
    }
    const goToFormularAdaugareShip = () => {
        sessionStorage.setItem("putScreen", "false");
        navigate('/formularShip');
    }

    const exporta = async () => {
        await get(routeExportShipFull);
    }
    const deleteShip = async (id, index) => {
        await remove(routeDeleteShip, id);

        rows.splice(index, 1);
        setRows(rows);
        setNeedToUpdate(!needToUpdate);
    }
    const sortare = async () => {
        let data = await get(routeGetShipSortate);
        setRows(data);
    }

    const goToFormularAdaugareCrewMember = (idShip) => {
        sessionStorage.setItem("putScreen", "false");
        sessionStorage.setItem("idShip", idShip);
        navigate('/formularCrewMember');
    }

    const goToTabelCrewMember = (idShip) => {
        sessionStorage.setItem("idShip", idShip);
        navigate('/crewMembers')
    }

    return (
        <div>
            <Grid container spacing={2}
                direction="row"
                justifyContent="space-evenly"
                alignItems="center">

                <Grid item xs={2}>
                    <Button color="tertiary" variant='contained' onClick={() => exporta()}>
                        Exporta ships
                    </Button >
                </Grid>

                <Grid item xs={2}>
                    <Button color="secondary" variant='contained' startIcon={<AddIcon />} onClick={() => goToFormularAdaugareShip()}>
                        Adauga ship
                    </Button >
                </Grid>

                <Grid item xs={2}>
                    <Button color="secondary" variant='contained' onClick={() => sortare()}>
                        Sorteaza dupa displacement
                    </Button >
                </Grid>

                

                
                <Grid container item spacing={1} xs={3}
                    direction="column"
                    justifyContent="center"
                    alignItems="center">

                    <TextField
                        margin="dense"
                        id="ShipNume"
                        name="ShipNume"
                        label="Filtrare dupa nume"
                        fullWidth
                        value={filtrare.ShipNume}
                        onChange={e => onChangeFiltrare(e)}
                    />
                    <TextField
                        margin="dense"
                        id="ShipDisplacement"
                        name="ShipDisplacement"
                        label="Filtrare dupa displacement"
                        fullWidth
                        value={filtrare.ShipDisplacement}
                        onChange={e => onChangeFiltrare(e)}
                    />
                    <Button color="secondary" variant='contained' onClick={() => filtrareShip()}
                    >
                        Filtrare
                    </Button>

                </Grid>
            </Grid>

            <br />

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Ship</TableCell>
                            <TableCell align="center">Nume Ship</TableCell>
                            <TableCell align="center">Ship Displacement</TableCell>
                            <TableCell align="center">CrewMembers</TableCell>
                            <TableCell align="center">Actiuni ship</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.ShipId}>
                                <TableCell component="th" scope="row">
                                    {row.ShipId}
                                </TableCell>
                                <TableCell align="center">{row.ShipNume}</TableCell>
                                <TableCell align="center">{row.ShipDisplacement}</TableCell>
                                <TableCell align="center">
                                    <Button color="primary" variant='contained' startIcon={<AddIcon />} onClick={() => goToFormularAdaugareCrewMember(row.ShipId)}>
                                        Adauga Crew Member
                                    </Button>
                                    <br /> <br />
                                    <Button color="primary" variant='contained' onClick={() => goToTabelCrewMember(row.ShipId)}>
                                        Vezi CrewMembers
                                    </Button>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => goToFormularModificareShip(row.ShipId)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteShip(row.ShipId, index)}>
                                        <DeleteIcon color="secondary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    )
}