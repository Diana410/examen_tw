import { useState, useEffect } from 'react';
import { get, remove } from '../Calls.js';
import { useNavigate } from 'react-router-dom';
import { routeGetCrewMembersByShip, routeDeleteCrewMember } from '../ApiRoutes';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Button, Paper, Table, TableBody, TableCell, TableRow, TableContainer, TableHead, IconButton } from "@material-ui/core";

export default function TabelCrewMembers() {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [needToUpdate, setNeedToUpdate] = useState(false)

    useEffect(async () => {
        let data = await get(routeGetCrewMembersByShip, JSON.parse(sessionStorage.getItem("idShip")));
        setRows(data);
    }, [needToUpdate]);
    useEffect(async () => {
        sessionStorage.setItem("putScreen", "");
        sessionStorage.setItem("idCrewMember", "");
    }, [])

    const goToFormularModificareCrewMember = (idRef) => {
        sessionStorage.setItem("putScreen", true);
        sessionStorage.setItem("idCrewMember", idRef);
        navigate('/formularCrewMember');
    }

    const deleteCrewMember = async (idRef, index) => {
        await remove(routeDeleteCrewMember, JSON.parse(sessionStorage.getItem("idShip")), idRef);

        rows.splice(index, 1);
        setRows(rows);
        setNeedToUpdate(!needToUpdate);
    }

    const goToFormularAdaugareCrewMember = () => {
        sessionStorage.setItem("putScreen", "false");
        navigate('/formularCrewMember');
    }

    return (
        <div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Crew Member</TableCell>
                            <TableCell align="center">Nume Crew Member</TableCell>
                            <TableCell align="center">Rol Crew Member</TableCell>
                            <TableCell align="center">Id ship de care apartine</TableCell>
                            <TableCell align="center">Actiuni pentru Crew Member</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.CrewMemberId}>
                                <TableCell component="th" scope="row">
                                    {row.CrewMemberId}
                                </TableCell>
                                <TableCell align="center">{row.CrewMemberNume}</TableCell>
                                <TableCell align="center">{row.CrewMemberRol}</TableCell>
                                <TableCell align="center">{row.ShipId}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => goToFormularModificareCrewMember(row.CrewMemberId)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteCrewMember(row.CrewMemberId, index)}>
                                        <DeleteIcon color="secondary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            <Button color="primary" variant='contained' startIcon={<AddIcon />} onClick={() => goToFormularAdaugareCrewMember()}>
                Adauga membru
            </Button>
            <br />
            <br />
            <Button color="primary" variant='contained' onClick={() => navigate('/')}>
                Inapoi la ships
            </Button>
        </div >
    )
}