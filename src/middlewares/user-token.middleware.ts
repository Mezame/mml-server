import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { publicKey } from '../configs/global.config.js';


function getUserIdFromToken(req: Request, res: Response, next: NextFunction) {

    const token = req.cookies['SESSIONID'];

    if (token) {

        try {

            const decoded = jwt.verify(token, publicKey);

            let authReq: any = req;

            authReq['userId' as keyof Request] = decoded.sub;

            req = authReq;

            next();

        } catch (err: any) {

            console.log('could not extract user token', err.message);

            res.clearCookie('SESSIONID');

            res.clearCookie('XSRF-TOKEN');

            next();

        }

    } else {

        next();

    }

}

export default getUserIdFromToken;