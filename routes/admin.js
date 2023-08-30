import express from "express";
const router = express.Router();

//dotenv config
import dotenv from "dotenv";
import {deleteUser, getAllUsers, getUserById} from "../app/userController.js";
import bcrypt from "bcrypt";
dotenv.config();

/* GET home page. */
router.get('/', async function (req, res, next) {
    //verify if user connected
    if (req.cookies['uid']) {
        //get the user
        const user = await getUserById(req.cookies['uid']);

        if (user) {
            //verify password with cookie hash
            if (user.role !== 'admin') {
                return res.redirect('/');
            }
        }
    } else {
        return res.redirect('/');
    }

    //render the admin page
    res.render('admin', {
        users: await getAllUsers(),
    });
});

router.get('/delete/:id', async function (req, res, next) {
    //verify if user connected
    if (req.cookies['uid']) {
        //get the user
        const user = await getUserById(req.cookies['uid']);

        if (user) {
            //verify password with cookie hash
            if (user.role !== 'admin') {
                return res.redirect('/');
            }
        }
    } else {
        return res.redirect('/');
    }

    //delete the user
    await deleteUser(req.params.id);

    //render the admin page
    res.render('admin', {
        users: await getAllUsers(),
    });
});

//route to add a user
router.post('/add', async function (req, res, next) {
    //verify if user connected
    if (req.cookies['uid']) {
        //get the user
        const user = await getUserById(req.cookies['uid']);

        if (user) {
            //verify password with cookie hash
            if (req.cookies['uhash'] && !await bcrypt.compare(req.cookies['uhash'], user.hash)) {
                return res.redirect('/');
            }
            if (user.role !== 'admin') {
                return res.redirect('/');
            }
        }
    } else {
        return res.redirect('/');
    }

    const hashedPassword = await bcrypt.hash(req.body.password);

    //add the user
    await addUser(req.body.email, hashedPassword, req.body.role);

    //render the admin page
    res.render('admin', {
        users: await getAllUsers(),
    });
});

export default router;