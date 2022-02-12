import axios from 'axios'
import {
    routeGetShipFull, routeGetShip, routeGetShipById, routeGetCrewMembers, routeGetCrewMembersByShip,
    routeGetCrewMemberByShip, routeGetShipFilter, routeGetShipSortate, routeExportShipFull,
    routePostShip, routePostCrewMember,
    routeDeleteShip, routeDeleteCrewMember,
    routePutShip, routePutCrewMember
} from './ApiRoutes.js'

async function get(p_url, searchAfter1 = null, searchAfter2 = null) {
    try {
        let newUrl;
        if (searchAfter1) {
            newUrl = p_url + "/" + searchAfter1;
            if (searchAfter2) {
                newUrl = newUrl + "/" + searchAfter2;
            }
        } else {
            newUrl = p_url;
        }

        return (await axios.get(newUrl)).data;

    } catch (err) {
        if (p_url === routeGetShipFull)
            alert('Nu s-au putut prelua Ship full.');
        if (p_url === routeGetShip)
            alert('Nu s-au putut prelua Ships.');
        if (p_url === routeGetCrewMembers)
            alert('Nu s-au putut prelua CrewMember.');
        if (p_url === routeGetShipSortate)
            alert('Nu s-au putut prelua Ships sortate.');
        if (p_url === routeExportShipFull)
            alert('Nu s-au putut exporta Ship.');
        if (p_url === routeGetShipById)
            alert('Nu s-a putut prelua Ship cu acest id.');
        if (p_url === routeGetCrewMembersByShip)
            alert('Nu s-au putut prelua CrewMember din acest Ship.');
        if (p_url === routeGetCrewMembersByShip)
            alert('Nu s-a putut prelua aceasta CrewMember din acest Ship.');
    }
}

async function getQuery(p_url, p_nume, p_displacement) {
    try {
        const params = new URLSearchParams({ nume: p_nume, displacement: p_displacement });
        let urlFilter = p_url + "?";
        return (await axios.get(`${urlFilter}${params}`)).data;
    } catch (err) {
        alert("Nu s-au putut prelua ships filtrate dupa nume si/sau displacement.");
    }
}


async function post(p_url, item, id = null) {
    try {
        let newUrl = id ? p_url + "/" + id : p_url;
        return (await axios.post(
            newUrl,
            item,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )).data;
    } catch (err) {
        if (p_url === routePostShip) {
            alert('Eroare la inserare Ship!');
        }
        if (p_url === routePostCrewMember) {
            alert('Eroare la inserare crewMember!');
        }
    }
}


async function put(p_url, item, searchAfter1, searchAfter2 = null) {
    try {
        let newUrl;
        newUrl = p_url + "/" + searchAfter1;
        if (searchAfter2) {
            newUrl = newUrl + "/" + searchAfter2;
        }

        return (await axios.put(
            newUrl,
            item,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )).data;
    } catch (err) {
        if (p_url === routePutShip) {
            alert('Eroare la modificare Ship!');
        }
        if (p_url === routePutCrewMember) {
            alert('Eroare la modificare crewMember!');
        }
    }
}


async function remove(p_url, searchAfter1, searchAfter2 = null) {
    try {
        let newUrl;
        newUrl = p_url + "/" + searchAfter1;
        if (searchAfter2) {
            newUrl = newUrl + "/" + searchAfter2;
        }

        return (await axios.delete(newUrl)).data;
    } catch (err) {
        if (p_url === routeDeleteShip) {
            alert('Eroare la stergere Ship!');
        }
        if (p_url === routeDeleteCrewMember) {
            alert('Eroare la stergere crewMember!');
        }
    }
}

export { get, getQuery, post, put, remove }