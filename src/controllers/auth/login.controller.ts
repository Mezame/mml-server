import { Request, Response } from "express";
import argon2 from "argon2";
import jwt from 'jsonwebtoken';
import { db } from '../../services/in-memory-database.service.js';
import { User } from "../../models/user.js";
import { privateKey } from "../../configs/global.config.js";

function login(req: Request, res: Response) {

    const credentials = req.body;

    const user = db.findOneUserByUsername(credentials.username);

    if (!user) {

        res.sendStatus(403);

    } else if (user.id == 2) {

        createSessionToken(user.id.toString()).then(async sessionToken => {

            const csrfToken = await createCsrfToken(sessionToken);

            res.cookie('SESSIONID', sessionToken, { httpOnly: true, secure: true });

            res.cookie('XSRF-TOKEN', csrfToken);

            res.status(200).send(user);

        });

    } else {

        validatePassword(credentials, user).then(async isPasswordValid => {

            if (!isPasswordValid) {

                console.log('invalid password');

                res.sendStatus(403);

            } else {

                const sessionToken = await createSessionToken(user.id.toString());

                const csrfToken = await createCsrfToken(sessionToken);

                res.cookie('SESSIONID', sessionToken, { httpOnly: true, secure: true });

                res.cookie('XSRF-TOKEN', csrfToken);

                res.status(200).send({ id: user.id, username: user.username });

            }

        });

    }

}

async function validatePassword(credentials: any, user: User) {

    const isPasswordValid = await argon2.verify(user.password,
        credentials.password);

    return isPasswordValid;

}

async function createSessionToken(userId: string) {

    const sessionToken = jwt.sign({}, privateKey, {
        algorithm: 'RS256',
        expiresIn: '15 days',
        subject: userId
    });

    return sessionToken;

}

async function createCsrfToken(sessionToken: string) {

    const csrfToken = argon2.hash(sessionToken);

    return csrfToken;

}

export default login;