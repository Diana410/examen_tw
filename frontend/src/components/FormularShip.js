import { useState, useEffect } from 'react';
import { get, put, post } from '../Calls.js';
import { useNavigate } from 'react-router-dom';
import { routePostShip, routeGetShipById, routePutShip } from '../ApiRoutes';

import SaveIcon from '@material-ui/icons/Save'
import { Grid, TextField, Button } from '@material-ui/core';

export default function FormularShip() {

    const navigate = useNavigate();

    const [ship, setShip] = useState({
        ShipId: 0,
        ShipNume: "",
        ShipDisplacement: "",
    })

    const onChangeShip = e => {
        setShip({ ...ship, [e.target.name]: e.target.value });
    }

    const saveShip = async () => {
        if (!JSON.parse(sessionStorage.getItem("putScreen")))
            await post(routePostShip, ship);
        else
            await put(routePutShip, ship, ship.ShipId);

        navigate('/');
    }

    useEffect(async () => {
        if (JSON.parse(sessionStorage.getItem('putScreen'))) {
            let data = await get(routeGetShipById, JSON.parse(sessionStorage.getItem("idShip")));
            setShip(data);
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
                        id="ShipId"
                        name="ShipId"
                        label="Id-ul pt Ship"
                        fullWidth
                        disabled={true}
                        value={ship.ShipId}
                        onChange={e => onChangeShip(e)} />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        margin="dense"
                        id="ShipNume"
                        name="ShipNume"
                        label="Ship nume"
                        fullWidth
                        value={ship.ShipNume}
                        onChange={e => onChangeShip(e)} />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        margin="dense"
                        id="ShipDisplacement"
                        name="ShipDisplacement"
                        label="Ship Displacement"
                        fullWidth
                        value={ship.ShipDisplacement}
                        onChange={e => onChangeShip(e)} />
                </Grid>
            </Grid>

            <br />

            <Button color="primary" variant='contained' startIcon={<SaveIcon />} onClick={() => saveShip()}>
                Save
            </Button>
        </div>
    )
}