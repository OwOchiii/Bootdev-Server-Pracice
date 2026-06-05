export async function handlerReadiness(req, res) {
    res.header("Content-Type", "text/plain");
    res.status(200);
    res.send("OK");
}
