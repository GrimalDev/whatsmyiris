//route to handle the login page

import express from "express";
const router = express.Router();

//dotenv config
import dotenv from "dotenv";
import {getUserByEmail, getUserById} from "../app/userController.js";
import {teams} from "../app/calendarHandle.js";
import {getDate} from "./home.js";
import bcrypt from "bcrypt";
dotenv.config();

/* GET home page. */
router.post('/login', async function (req, res, next) {
    //handle the post data from the login page
    //check if already logged in

    if (req.cookies['uid']) {
        const user = await getUserById(req.cookies['uid']);

        if (user) {
            return res.redirect('/');
        }
    }

    //if not, connect the user
    const user = await getUserByEmail(req.body.login);

    if (user) {
        //verify the password
        if (await bcrypt.compare(req.body.password, user.hash)) {
            //set the cookie and hash
            res.cookie('uid', user.id);
            res.cookie('uhash', user.hash);
        }
    }

    //render the login page with the error message
    res.redirect('/');
});

//route to handle the logout page
router.get('/logout', async function (req, res, next) {
    //handle the post data from the login page
    //check if already logged in

    if (req.cookies['uid']) {
        res.clearCookie('uid');
        res.clearCookie('uhash');
    }

    //render the login page with the error message
    res.redirect('/');
});

export default router;