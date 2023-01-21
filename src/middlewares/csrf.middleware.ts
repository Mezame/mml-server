import { Request, Response, NextFunction } from 'express';


function checkCsrfToken(req: Request, res: Response, next: NextFunction) {

    const csrfCookie = req.cookies['XSRF-TOKEN'];

    const csrfHeader = req.headers['x-xsrf-token'];

    if (csrfCookie && csrfHeader && csrfCookie === csrfHeader) {

        next();

    } else {

        res.sendStatus(403);

    }
}

export default checkCsrfToken;