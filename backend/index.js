import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import mysql from 'mysql2/promise';
import { DB_USERNAME, DB_PASSWORD } from './Const.js';
import db from './dbConfig.js';
import Ship from './entities/Ship.js'
import CrewMember from './entities/CrewMember.js'

import LikeOperator from './Operators.js'

import fs from 'fs';
'use strict';

let app = express();
let router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);


//----------------creare conexiune baza de date--------------------
let conn;

mysql.createConnection({
    user: DB_USERNAME,
    password: DB_PASSWORD
})
    .then(connection => {
        conn = connection;
        return connection.query("CREATE DATABASE IF NOT EXISTS EXAMEN");
    })
    .then(() => {
        return conn.end();
    })
    .catch(err => {
        console.log(err);
    });
//-------------------sfarsit creare conexiune baza de date-------------------


//----------legatura one to many intre cele doua entitati----------------
Ship.hasMany(CrewMember, { as: "CrewMembers", foreignKey: "ShipId" });
CrewMember.belongsTo(Ship, { foreignKey: "ShipId" });

//---------sfarsit legatura one to many intre cele doua entitati------------



//--------------------GET---------------------------------

//afisare Ship impreuna cu CrewMember aferent  (afisare toti parintii cu toti copiii aferenti)
async function getShipFull() {
    return await Ship.findAll({ include: ["CrewMembers"] });
}
router.route('/getShipFull').get(async (req, res) => {
    try {
        return res.json(await getShipFull());
    }
    catch (err) {
        console.log(err.message);
    }
})


//afisare doar ship, fara crewMember lor   (afisare toti parintii, fara copiii lor)
async function getShip() {
    return await Ship.findAll();
}
router.route('/getShip').get(async (req, res) => {
    try {
        return res.json(await getShip());
    }
    catch (err) {
        console.log(err.message);
    }
})


//afisare ship cu un anumit id    (afisare parinte dupa id)
async function getShipById(id) {
    return await Ship.findOne(
        {
            where: id ? { ShipId: id } : undefined
        }
    );
}
router.route('/getShipById/:id').get(async (req, res) => {
    try {
        return res.json(await getShipById(req.params.id));
    }
    catch (err) {
        console.log(err.message);
    }
})


//afisare toti crewMember   (afisare toti copiii indiferent de ce parinte au)
async function getCrewMembers() {
    return await CrewMember.findAll();
}
router.route('/getCrewMembers').get(async (req, res) => {
    try {
        return res.json(await getCrewMembers());
    }
    catch (err) {
        console.log(err.message);
    }
})



//afisare crewMember ale unui anumit ship    (afisare toti copiii unui parinte)
async function getCrewMembersByShip(idShip) {
    if (!(await getShipById(idShip))) {
        console.log("Nu s-a gasit Ship!");
        return;
    }
    return await CrewMember.findAll({
        include: [{ model: Ship, attributes: ["ShipNume"], where: idShip ? { ShipId: idShip } : undefined }]
    });
}
router.route('/getCrewMembersByShip/:idShip').get(async (req, res) => {
    try {
        return res.json(await getCrewMembersByShip(req.params.idShip));
    }
    catch (err) {
        console.log(err.message);
    }
})


//afisare un anumit crewMember dintr-un ship   (afisare doar un copil al parintelui)
async function getCrewMemberByShip(idShip, idCrewMember) {
    if (!(await getShipById(idShip))) {
        console.log("Nu s-a gasit Ship!");
        return;
    }
    return await CrewMember.findOne(
        {
            include: [{ model: Ship, attributes: ["ShipNume"], where: idShip ? { ShipId: idShip } : undefined }],
            where: idCrewMember ? { CrewMemberId: idCrewMember } : undefined
        }
    )
}
router.route('/getCrewMemberByShip/:idShip/:idCrewMember').get(
    async (req, res) => {
        try {
            return res.json(await getCrewMemberByShip(req.params.idShip, req.params.idCrewMember));
        } catch (err) {
            console.log(err.message);
        }
    }
)


//afisare toate ship unde numele contine CEVA si/sau displacement contine ALTCEVA   (afisare parinti filtrati dupa 2 campuri)
async function getShipFilter(filterQuery) {
    let whereClause = {};

    if (filterQuery.nume)
        whereClause.ShipNume = { [LikeOperator]: `%${filterQuery.nume}%` };
    if (filterQuery.displacement)
        whereClause.ShipDisplacement = { [LikeOperator]: `%${filterQuery.displacement}%` };

    return await Ship.findAll({
        where: whereClause
    })
}
router.route('/getShipFilter').get(async (req, res) => {
    try {
        return res.json(await getShipFilter(req.query));
    }
    catch (err) {
        console.log(err.message);
    }
})


//afisare ship sortate descrescator dupa displacement   (afisare parinti - sortare)
async function getShipSortateDupaDisplacement() {
    return await Ship.findAll({
        order: [
            ["ShipDisplacement", "DESC"]
        ]
    });
}
router.route('/getShipSortateDupaDisplacement').get(async (req, res) => {
    try {
        return res.json(await getShipSortateDupaDisplacement());
    }
    catch (err) {
        console.log(err.message);
    }
})


//export sub forma de json
async function exportShipFull() {
    if (!fs.existsSync("./exported"))
        fs.mkdirSync("./exported")
    fs.writeFileSync("./exported/ship_full.json", JSON.stringify(await getShipFull()));
}
router.route('/exportShipFull').get(async (req, res) => {
    try {
        await exportShipFull();
        res.download("./exported/ship_full.json", "downloadShipFull.json");
    } catch (err) {
        console.log(err.message);
    }
})
//-----------------SFARSIT GET------------------------




//----------------POST----------------------------------- 

//adaugare ship      (adaugare parinte)
async function createShip(ship) {
    return await Ship.create(ship);
}
router.route('/addShip').post(async (req, res) => {
    try {
        return res.status(201).json(await createShip(req.body));
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error_message: "Internal server error! Could not insert Ship!" });
    }
})


// async function createCrewMember(crewMember){
//     return await CrewMember.create(crewMember);
// }
// router.route('/addCrewMember').post(async (req, res)=>{
//     try{
//         return res.status(201).json(await createCrewMember(req.body));
//     }catch(err){
//         console.log(err.message);
//         return res.status(500).json({error_message: "Internal server error! Could not insert member!"});
//     }
// })


// adaugare CrewMember pentru un anumit Ship         (adaugare copil la parinte)
async function createCrewMember(crewMember, idShip) {
    if (!(await getShipById(idShip))) {
        console.log("Nu s-a gasit Ship");
        return;
    }
    crewMember.ShipId = idShip;
    return await CrewMember.create(crewMember);
}
router.route('/addCrewMember/:idShip').post(async (req, res) => {
    try {
        return res.status(201).json(await createCrewMember(req.body, req.params.idShip));
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error_message: "Internal server error! Could not insert member!" });
    }
})

//--------------SFARSIT POST-------------------------------


//---------------------PUT--------------------

//update ship   (update parinte)
async function updateShip(updatedShip, idShip) {
    if (parseInt(idShip) !== updatedShip.ShipId) {
        console.log("ID diferit intre id ruta si id body");
        return;
    }
    let ship = await getShipById(idShip);
    if (!ship) {
        console.log("Nu exista Ship cu acest id");
        return;
    }

    return await ship.update(updatedShip);
}
router.route("/updateShip/:idShip").put(async (req, res) => {
    try {
        return res.json(await updateShip(req.body, req.params.idShip));
    } catch (err) {
        console.log(err.message);
    }
})


//update crewmember a unui ship       (update copil al unui anumit parinte)
async function updateCrewMember(updatedCrewMember, idShip, idCrewMember) {
    if (parseInt(idCrewMember) !== updatedCrewMember.CrewMemberId) {
        console.log("ID CrewMember diferit intre id ruta si id body");
        return;
    }

    let ship = await getShipById(idShip);
    if (!ship) {
        console.log("Nu exista Ship cu acest id");
        return;
    }

    let crewMember = await getCrewMemberByShip(idShip, idCrewMember);
    if (!crewMember) {
        console.log("Nu exista CrewMember cu acest id pentru acest Ship");
        return;
    }

    return await crewMember.update(updatedCrewMember);
}
router.route("/updateCrewMember/:idShip/:idCrewMember").put(async (req, res) => {
    try {
        return res.json(await updateCrewMember(req.body, req.params.idShip, req.params.idCrewMember));
    } catch (err) {
        console.log(err.message);
    }
})
//-------------------SFARSIT PUT-------------------



//-----------------DELETE-------------------------

//sterge ship - implicit se sterg si crewMembers aferenti     (delete parinte)
async function deleteShip(idShip) {
    let shipToBeDeleted = await getShipById(idShip);

    if (!shipToBeDeleted) {
        console.log("Nu exista Ship cu acest id");
        return;
    }

    return await shipToBeDeleted.destroy();
}
router.route("/deleteShip/:idShip").delete(async (req, res) => {
    try {
        return res.json(await deleteShip(req.params.idShip));
    } catch (err) {
        console.log(err.message);
    }
})


//stergere crewmember a unui anumit ship specific     (stergere copil al unui parinte)
async function deleteCrewMember(idShip, idCrewMember) {

    let ship = await getShipById(idShip);
    if (!ship) {
        console.log("Nu exista Ship cu acest id");
        return;
    }

    let crewMemberToBeDeleted = await getCrewMemberByShip(idShip, idCrewMember);

    if (!crewMemberToBeDeleted) {
        console.log("Nu exista CrewMember cu acest id la acest Ship");
        return;
    }

    return await crewMemberToBeDeleted.destroy();
}
router.route("/deleteCrewMember/:idShip/:idCrewMember").delete(async (req, res) => {
    try {
        return res.json(await deleteCrewMember(req.params.idShip, req.params.idCrewMember));
    } catch (err) {
        console.log(err.message);
    }
})
//-----------------SFARSIT DELETE----------------


// let port = process.env.PORT || 8000;
// app.listen(port);
// console.log("API is running at "+port);

let port = process.env.PORT || 8000;
app.listen(port, async () => {
    await db.sync({ alter: true });
    console.log("Baza de date sincronizata cu succes!");
});
console.log("API is running at " + port);
