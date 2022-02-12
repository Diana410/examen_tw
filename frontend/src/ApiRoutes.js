const link = "http://localhost:8000/api";

const routeGetShipFull = link + '/getShipFull';
const routeGetShip = link + '/getShip';
const routeGetShipById = link + '/getShipById';
const routeGetCrewMembers = link + '/getCrewMembers';
const routeGetCrewMembersByShip = link + '/getCrewMembersByShip'; 
const routeGetCrewMemberByShip = link + '/getCrewMemberByShip'; 
const routeGetShipFilter = link + '/getShipFilter'; 
const routeGetShipSortate = link + '/getShipSortateDupaDisplacement';
const routeExportShipFull = link + '/exportShipFull';

const routePostShip = link + '/addShip';
const routePostCrewMember = link + '/addCrewMember'; 

const routeDeleteShip = link + '/deleteShip';  
const routeDeleteCrewMember = link + '/deleteCrewMember'; 

const routePutShip = link + '/updateShip'; 
const routePutCrewMember = link + '/updateCrewMember'; 


export {
    routeGetShipFull, routeGetShip, routeGetShipById, routeGetCrewMembers, routeGetCrewMembersByShip,
    routeGetCrewMemberByShip, routeGetShipFilter, routeGetShipSortate, routeExportShipFull,
    routePostShip, routePostCrewMember,
    routeDeleteShip, routeDeleteCrewMember,
    routePutShip, routePutCrewMember
}


