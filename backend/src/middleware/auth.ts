import { Request, Response, NextFunction } from "express";

export const requireAdmin = (req: Request, res:Response, next:NextFunction) =>{
    if(req.cookies?.admin==='true')return next();
    res.status(401).json({message: "Unauthorized"});
};