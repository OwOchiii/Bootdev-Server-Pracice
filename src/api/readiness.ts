import { Request, Response } from "express"

export async function handlerReadiness(req: Request, res: Response) {
    res.header("Content-Type", "text/plain",)
    res.status(200)
    res.send("OK")
}