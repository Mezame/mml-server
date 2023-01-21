import { Request, Response, NextFunction } from 'express';


function checkIfAuthenticated(req: Request, res: Response, next: NextFunction) {

    const authReq: any = req;

    if (authReq['userId']) {

        next();

    } else {

        res.sendStatus(403);

    }

}

export default checkIfAuthenticated;