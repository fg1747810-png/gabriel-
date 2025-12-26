import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 80;

// pasta de logs
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

app.use((req, res, next) => {
    const data = {
        host: req.headers.host,
        connection: req.headers.connection,
        "upgrade-insecure-requests": req.headers["upgrade-insecure-requests"],
        "user-agent": req.headers["user-agent"],
        accept: req.headers.accept,
        "x-requested-with": req.headers["x-requested-with"],
        referer: req.headers.referer,
        "accept-encoding": req.headers["accept-encoding"],
        "accept-language": req.headers["accept-language"],
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        ips: req.ips || [],
        date: new Date().toISOString()
    };

    const fileName = `${Date.now()}.json`;
    fs.writeFileSync(
        path.join(logsDir, fileName),
        JSON.stringify(data, null, 2)
    );

    console.log("Novo acesso registrado:", fileName);
    next();
});

app.get("/", (req, res) => {
    res.send("Servidor ativo");
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
