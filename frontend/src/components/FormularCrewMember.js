import { useState, useEffect } from 'react';
import { get, put, post } from '../Calls.js';
import { useNavigate } from 'react-router-dom';
import { routePostCrewMember, routePutCrewMember, routeGetCrewMemberByShip } from '../ApiRoutes';

import SaveIcon from '@material-ui/icons/Save'
import { Grid, TextField, Button } from '@material-ui/core';

export default function FormularCrewMember() {

    const navigate = useNavigate();

    const [crewMember, setCrewMember] = useState({
        CrewMemberId: 0,
        CrewMemberNume: "",
        CrewMemberRol: "",
        ShipId: JSON.parse(sessionStorage.getItem("idShip"))
    })

    const onChangeCrewMember = e => {
        setCrewMember({ ...crewMember, [e.target.name]: e.target.value });
    }

    const saveCrewMember = async () => {
        if (!JSON.parse(sessionStorage.getItem("putScreen")))
            await post(routePostCrewMember, crewMember, JSON.parse(sessionStorage.getItem("idShip")));  
        else
            await put(routePutCrewMember, crewMember, crewMember.ShipId, crewMember.CrewMemberId);  

        navigate('/crewMembers');
    }

    useEffect(async () => {
        if (JSON.parse(sessionStorage.getItem('putScreen'))) {  
            let data = await get(routeGetCrewMemberByShip, JSON.parse(sessionStorage.getItem("idCrewMember")), JSON.parse(sessionStorage.getItem("idCrewMember")));
            setCrewMember(data);
        }
    }, [])

    return (
        <div>
            <Grid container
                spacing={2}
                direction="row"
                justifyContent="flex-start">

                <Grid item xs={2}>
                    <TextField
                        margin="dense"
                        id="CrewMemberId"
                        name="CrewMemberId"
                        label="Id-ul membrului"
                        fullWidth
                        disabled={true}
                        value={crewMember.CrewMemberId}
                        onChange={e => onChangeCrewMember(e)} />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        margin="dense"
                        id="CrewMemberNume"
                        name="CrewMemberNume"
                        label="Nume Crew Member"
                        fullWidth
                        value={crewMember.CrewMemberNume}
                        onChange={e => onChangeCrewMember(e)} />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        margin="dense"
                        id="CrewMemberRol"
                        name="CrewMemberRol"
                        label="Rol Crew Member"
                        fullWidth
                        value={crewMember.CrewMemberRol}
                        onChange={e => onChangeCrewMember(e)} />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        margin="dense"
                        id="ShipId"
                        name="ShipId"
                        label="Id-ul de la ship de care apartine"
                        fullWidth
                        disabled={true}
                        value={crewMember.ShipId}
                        onChange={e => onChangeCrewMember(e)} />
                </Grid>
            </Grid>

            <br />

            <Button color="primary" variant='contained' startIcon={<SaveIcon />} onClick={() => saveCrewMember()}>
                Save
            </Button>
        </div>
    )
}