import { Request, Response } from 'express';


export function logout(_req: Request, res: Response) {

    res.clearCookie('SESSIONID');

    res.clearCookie('XSRF-TOKEN');

    res.status(200).send({ message: 'OK' });

}