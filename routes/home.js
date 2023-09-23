import express from "express";
import {teams} from "../app/calendarHandle.js";
// import {getUserById} from "../app/userController.js";
import bcrypt from "bcrypt";

const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    //if connected, render calendar view
    //get the connection from the cookie (id -> hash)

    // if (req.cookies['uid']) {
    //     const user = await getUserById(req.cookies['uid']);
    //
    //     if (user) {
    //         //verify password with cookie hash
    //         return res.render('home', {
    //             date: await getDate(),
    //             teams: teams,
    //             role: user.role
    //         });
    //     }
    // }

    return res.render('home', {
                    date: await getDate(),
                    teams: teams,
                });
});

//get current date
export async function getDate() {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    return today.toLocaleDateString("fr-FR", options);
}

export default router;