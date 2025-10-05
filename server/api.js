const http = require("http");
const url = require("url");
const db = require("./db");
const fs = require("fs");
const querystring = require("querystring");
const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const nodemailer = require("nodemailer");
const createAndFillWorkbook = require("./writeexcel");
const ExcelJS = require("exceljs");
const os = require("os");

const pino = require('pino');
const pinoHttp = require('pino-http');
const pretty = require('pino-pretty');

function getLogPath(level){
    const today = new Date().toISOString().split('T')[0];
    const dir = path.join(__dirname, "../Presentation/system/logs", today);
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    return path.join(dir, `${today}-${level}.log`);
}

const transport = pino.transport({
    targets: [
        {
            level: 'info',
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname'
            }
        },
        {
            level: 'info',
            target: 'pino-pretty',
            options: {
                colorize: false,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
                destination: getLogPath('info')
            }
        },
        ...['warn', 'error', 'fatal'].map(level => ({
            level,
            target: 'pino-pretty',
            options: {
                colorize: false,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
                destination: getLogPath('error')
            }
        }))
    ]
})

const logger = pino(
    { level: 'info' },
    transport
);

const httpLogger = pinoHttp({ 
    logger,
    autoLogging: false
});



const interfaces = os.networkInterfaces();

let ipAddress = null;

for(const name of Object.keys(interfaces)){
    for(const iface of interfaces[name]){
        if(iface.family === 'IPv4' && !iface.internal){
            ipAddress = iface.address;
            break;
        }
    }
    if(ipAddress){
        break;
    }
}



const pageRoutes = {
    '/login': ['login', 'index.html'],
    '/detail': ['detail', 'index.html'],
    '/list': ['list', 'index.html'],
    '/registrationfix': ['registrationfix', 'index.html'],
    '/signin': ['signin', 'index.html'],
    '/usermanage': ['usermanage', 'index.html'],
}

const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".jpeg": "image/jpeg"
};

const setCorsHeaders = (res) => {
    res.setHeader("Access-Control-Allow-Origin", `http://${ipAddress}:5500`);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
};

function verifyToken (req, userManageRight = null){
    return new Promise((resolve, reject) => {
        const authHeader = req.headers["authorization"];
        if(!authHeader){
            reject({method: req.method, path: req.url, status: 401, message: "Unauthorized"});
            return;
        }
        const token = authHeader.split(" ")[1];
        if(!token){
            reject({method: req.method, path: req.url, status: 401, message: "Unauthorized"});
            return;
        }
        jwt.verify(token, SECRET, (err, decoded) => {
            if(err){
                reject({method: req.method, path: req.url, status: 403, message: "Forbidden"});
                return;
            }
            if (userManageRight && decoded.user_manage_right !== true){
                reject({method: req.method, path: req.url, status: 403, message: "Forbidden"});
                return;
            }
            // resolve(decoded);
            db.query("SELECT * FROM users WHERE email_address = $1", [decoded.email_address], (err, result) => {
                logger.info(`Start ${req.method}, ${req.url}, ${result.rows[0].user_id}`);
                resolve(result.rows[0].user_id);
            });
        });
    });
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});


const server = http.createServer( (req, res) => {
    httpLogger(req, res);
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const pathUrl = parsedUrl.pathname;
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;


    // CORS preflight 요청 처리
    if (method === "OPTIONS") {
        setCorsHeaders(res);
        res.writeHead(200);
        res.end();
        return;
    }

    // API 요청 처리
    
    //about tasks
    if (method === "GET" && pathUrl === "/tasks"){
        setCorsHeaders(res);
        verifyToken(req)
        .then(user => {
            db.query("SELECT * FROM tasks", (err, result) => {
                if(err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Internal Server Error");
                    logger.error(`End   ${req.method}, ${req.url}, internal-server-error ${user}`);
                    return;
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" }); 
                    res.end(JSON.stringify(result.rows));
                    logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
                    return;
                }
            }); 
        })
        .catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        });
        return;
    }

    if (method === "GET" && /^\/tasks\/\d+$/.test(pathUrl)){
        setCorsHeaders(res);
        verifyToken(req)
        .then(user => {
            const id = pathUrl.split("/")[2];
            db.query("SELECT * FROM tasks WHERE task_id = $1", [id], (err, result) => {
                if(err) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "invalid json" }));
                    logger.info(`End   ${req.method}, ${req.url}, invalid-json ${user}`);
                    return;
                } else {
                    if(result.rows.length === 0){
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "課題が見つかりません" }));
                        logger.info(`End   ${req.method}, ${req.url}, task-not-found ${user}`);
                        return;
                    }else{
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify(result.rows[0]));
                        logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
                        return;
                    }
                }
            });
        })
        .catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        });
    }

    if (method === "POST" && pathUrl === "/tasks"){
        setCorsHeaders(res);
        verifyToken(req)
        .then(user => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const taskData = JSON.parse(body);
                    const query = `
                        INSERT INTO tasks (status, priority, suggested_by, assigned_to, updated_by, suggested_at, deadline, completed_at, updated_at, title, task_description, action_description)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                        RETURNING task_id
                    `;
                    const values = [taskData.status, taskData.priority, taskData.suggest_by, taskData.assigned_to, taskData.updated_by, taskData.suggested_at, taskData.deadline, taskData.completed_at, taskData.updated_at, taskData.title, taskData.task_description, taskData.action_description];
                    const result = await db.query(query, values);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "課題が作成されました", task_id: result.rows[0].task_id }));
                    logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
                    return;
                } catch (error) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid JSON" }));
                    logger.info(`End   ${req.method}, ${req.url}, invalid-json ${user}`);
                    return;
                }
            });

        })
        .catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        });
    }

    if (method === "GET" && pathUrl === "/tasks/search"){
        setCorsHeaders(res);
        verifyToken(req)
        .then(user => {
            const {status, priority, title, suggestedBy, suggestedAtStart, suggestedAtEnd, assignedTo, deadlineStart, deadlineEnd, completedAtStart, completedAtEnd} = parsedUrl.query;
            let query = 'SELECT * FROM tasks WHERE 1=1';
            let index = 1;
            const values = [];

            let listConditions = {status: status, priority: priority};
            let overRangeConditions = {suggested_at: suggestedAtStart, deadline: deadlineStart, completed_at: completedAtStart};
            let underRangeConditions = {suggested_at: suggestedAtEnd, deadline: deadlineEnd, completed_at: completedAtEnd};
            let partialConditions = {title: title};
            let matchConditions = {suggested_by: suggestedBy, assigned_to: assignedTo};

            Object.entries(listConditions).forEach(([key, value]) => {
                if(value){
                    const list = value.split(',').map( s => Number(s.trim()));
                    query += ` AND ` + key + ` = ANY($${index++})`;
                    values.push(list);
                }
            });

            Object.entries(overRangeConditions).forEach(([key, value]) => {
                if(value){
                    query += ` AND ` + key + ` >= $${index++}`;
                    values.push(value);
                }
            });

            Object.entries(underRangeConditions).forEach(([key, value]) => {
                if(value){
                    query += ` AND ` + key + ` <= $${index++}`;
                    values.push(value);
                }
            });

            Object.entries(partialConditions).forEach(([key, value]) => {
                if(value){
                    query += ` AND ` + key + ` ILIKE $${index++}`;
                    values.push(`${value}%`);
                }
            });

            Object.entries(matchConditions).forEach(([key, value]) => {
                if(value){
                    query += ` AND ` + key + ` = $${index++}`;
                    values.push(Number(value));
                }
            });

            db.query(query, values, (err, result) => {
                if(err){
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Internal Server Error" }));
                    logger.error(`End   ${req.method}, ${req.url}, internal-server-error ${user}`);
                    return;
                }else if(result.rows.length === 0){
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify([]));
                    logger.info(`End   ${req.method}, ${req.url}, task-not-found ${user}`);
                    return;
                }else{
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result.rows));
                    logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
                    return;
                }
            });
        })
        .catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        });
        
        return;
    }

    if (method === "POST" && pathUrl === "/task/excel"){
        setCorsHeaders(res);
        verifyToken(req)
        .then(user => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const taskData = JSON.parse(body);
                    
                    res.writeHead(200, { 
                        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                        "Content-Disposition": "attachment; filename=task.xlsx" 
                    });
                    
                    const workbook = await createAndFillWorkbook(taskData);
                    await workbook.xlsx.write(res);
                    
                    res.end();
                    logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
                    return;
                } catch (error) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid JSON" }));
                    logger.info(`End   ${req.method}, ${req.url}, invalid-json ${user}`);
                    return;
                }
            });
        })
        .catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        });
        return;
    }

    if (method === "PUT" && pathUrl.includes("/tasks")){
        setCorsHeaders(res);
        verifyToken(req)
        .then(user => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const taskData = JSON.parse(body);
                    const query = `
                        UPDATE tasks SET status = $2, priority = $3, suggested_by = $4, assigned_to = $5, updated_by = $6, suggested_at = $7, deadline = $8, completed_at = $9, updated_at = $10, title = $11, task_description = $12, action_description = $13
                        WHERE task_id = $1
                    `;
                    const values = [taskData.task_id, taskData.status, taskData.priority, taskData.suggest_by, taskData.assigned_to, taskData.updated_by, taskData.suggested_at, taskData.deadline, taskData.completed_at, taskData.updated_at, taskData.title, taskData.task_description, taskData.action_description];
                    const result = await db.query(query, values);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "課題が更新されました" }));
                    logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
                    return;
                } catch (error) {
                    if(db.error){
                        res.writeHead(500, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Internal Server Error" }));
                        logger.error(`End   ${req.method}, ${req.url}, internal-server-error ${user}`);
                        return;
                    }
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid JSON" }));
                    logger.info(`End   ${req.method}, ${req.url}, invalid-json ${user}`);
                    return;
                }
            });
        })
        .catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        });
        return;
    }

    if (method === "DELETE" && pathUrl.includes("/tasks")){
        setCorsHeaders(res);
        verifyToken(req)
        .then(user => {
            const id = pathUrl.split("/")[2];
            db.query("DELETE FROM tasks WHERE task_id = $1", [id], (err, result) => {
                if(err){
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Internal Server Error" }));
                    logger.error(`End   ${req.method}, ${req.url}, internal-server-error ${user}`);
                    return;
                }else{
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "課題が削除されました" }));
                    logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
                    return;
                }
            });
        })
        .catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        });
        return;
    }

    //about users
    if (method === "GET" && pathUrl === "/users"){
        setCorsHeaders(res);
        verifyToken(req)
        .then(user => {
            db.query("SELECT * FROM users", (err, result) => {
                if(err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Internal Server Error");
                    logger.error(`End   ${req.method}, ${req.url}, internal-server-error ${user}`);
                    return;
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result.rows));
                    logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
                    return;
                }
            });
        })
        .catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        });
        return;
    }
    
    if (method === "GET" && pathUrl === "/status"){
        setCorsHeaders(res);
        verifyToken(req)
        .then(user => {
            db.query("SELECT * FROM statuses", (err, result) => {
                if(err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Internal Server Error");
                    logger.error(`End   ${req.method}, ${req.url}, internal-server-error ${user}`);
                    return;
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result.rows));
                    logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
                    return;
                }
            });
        })
        .catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        });
        return;
    }

    if (method === "GET" && pathUrl === "/priority"){
        setCorsHeaders(res);
        verifyToken(req)
        .then(user => {
            db.query("SELECT * FROM priorities", (err, result) => {
                if(err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Internal Server Error");
                    logger.error(`End   ${req.method}, ${req.url}, internal-server-error ${user}`);
                    return;
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result.rows));
                    logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
                    return;
                }
            });
        })
        .catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        });
        return;
    }

    if (method === "POST" && pathUrl === "/userlogin") {
        logger.info(`Start ${req.method}, ${req.url}`);
        setCorsHeaders(res);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const userData = JSON.parse(body);
                const emailCheck = await db.query("SELECT * FROM users WHERE email_address = $1", [userData.email]);
                if(emailCheck.rows.length === 0){
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "メールアドレスまたはパスワードを確認してください" }));
                    logger.info(`End   ${req.method}, ${req.url}, wrong-email`);
                    return;
                }else{
                    const passwordCheck = await bcrypt.compare(userData.password, emailCheck.rows[0].password);
                    if(!passwordCheck){
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "メールアドレスまたはパスワードを確認してください" }));
                        logger.info(`End   ${req.method}, ${req.url}, wrong-password`);
                        return;
                    }else{
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "ログインしました" }));
                        logger.info(`End   ${req.method}, ${req.url}, success, ${emailCheck.rows[0].user_id}`);
                        return;
                    }
                }
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                logger.info(`End   ${req.method}, ${req.url}, invalid-json`);
                return;
            }
        });
    }

    if (method === "POST" && pathUrl === "/users") {
        logger.info(`Start ${req.method}, ${req.url}`);
        setCorsHeaders(res);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const userData = JSON.parse(body);
                const emailCheck = await db.query("SELECT * FROM users WHERE email_address = $1", [userData.email]);
                if(emailCheck.rows.length > 0){
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "既に同じメールアドレスが存在します" }));
                    logger.info(`End   ${req.method}, ${req.url}, already-exist-email`);
                    return;
                }else{
                    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
                    db.query(
                        "INSERT INTO users (last_name, first_name, email_address, password) VALUES ($1, $2, $3, $4)",
                        [userData.lastName, userData.firstName, userData.email, hashedPassword],
                        (err, result) => {
                        if(err) {
                            res.writeHead(500, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ error: "Internal Server Error" }));
                            logger.error(`End   ${req.method}, ${req.url}, internal-server-error`);
                            return;
                        }
                        res.writeHead(201, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ message: "新規登録が完了しました" }));
                        logger.info(`End   ${req.method}, ${req.url}, success`);
                        return;
                        }
                    );
                }
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                logger.info(`End   ${req.method}, ${req.url}, invalid-json`);
                return;
            }
        });
    }

    if (method === "POST" && pathUrl === "/session") {
        logger.info(`Start ${req.method}, ${req.url}`);
        setCorsHeaders(res);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const userData = JSON.parse(body);
                const emailCheck = await db.query("SELECT * FROM users WHERE email_address = $1", [userData.email]);
                const user = emailCheck.rows.find(u => u.email_address === userData.email );
                if(user){
                    const token = jwt.sign({ 
                        last_name: user.last_name, 
                        first_name: user.first_name, 
                        email_address: user.email_address, 
                        take_deltete_right: user.take_deltete_right, 
                        take_update_right: user.take_update_right, 
                        take_create_right: user.take_create_right, 
                        user_manage_right: user.user_manage_right }, 
                        SECRET, {
                            expiresIn: '30m'
                        } 
                        );
                    const decoded = jwt.decode(token, { complete: true });
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ token }));
                    logger.info(`End   ${req.method}, ${req.url}, success ${emailCheck.rows[0].user_id}`);
                    return;
                }else{
                    res.writeHead(401, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid username or password" }));
                    logger.info(`End   ${req.method}, ${req.url}, rejected`);
                    return;
                }
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                logger.info(`End   ${req.method}, ${req.url}, invalid-json`);
                return;
            }
        });
    }

    if (method === "GET" && pathUrl === "/profile") {
        setCorsHeaders(res);

        if(!req.headers["authorization"]){
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        }else{
            const authHeader = req.headers["authorization"];
            if(!authHeader.split(" ")[1]){
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Unauthorized" }));
                logger.info(`${req.method}, ${req.url}, unauthorized-request`);
                return;
            }else{
                const token = authHeader.split(" ")[1];
                try {
                
                    const decoded = jwt.verify(token, SECRET);
                    db.query("SELECT * FROM users WHERE email_address = $1", [decoded.email_address], (err, result) => {
                        if(err){
                            res.writeHead(401, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ error: "User not found" }));
                            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
                            return;
                        }
                        const user = result.rows.find(user => user.email_address === decoded.email_address);
                        const profile = {
                            user_id: user.user_id,
                            last_name: user.last_name,
                            first_name: user.first_name,
                            email_address: user.email_address,
                            task_delete_right: user.task_delete_right,
                            user_manage_right: user.user_manage_right
                        }
            
                        if(!user){
                            res.writeHead(401, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ error: "User not found" }));
                            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
                            return;
                        }
                        logger.info(`Start ${req.method}, ${req.url}, ${user.user_id}`);
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify(profile));
                        logger.info(`End   ${req.method}, ${req.url}, success ${user.user_id}`);
                        return;
                    });
                } catch (error) {
                    res.writeHead(403, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "invalid token" }));
                    logger.info(`End   ${req.method}, ${req.url}, invalid-token`);
                    return;
                }
            }
        }
    }   
        
    if (method === "GET" && pathUrl === "/api/authcheck") {
        setCorsHeaders(res);
        const user = verifyToken(req);
        user.then(user => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify( user ));
            logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
            return;
        }).catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: error }));
            logger.info(`End   ${req.method}, ${req.url}, rejected`);
            return;
        });

        
        
    }


    if (pathUrl.includes("/detail")){
        const matchedUrl = '/detail';
        if(path.extname(pathUrl)){
            const segments = pathUrl.split("/");
            const folder = segments[1];
            const restPath = segments[segments.length - 1];
            const filePath = path.join(__dirname, "../Presentation", folder, restPath);
            
            fs.readFile(filePath, (err, data) => {
                if(err){
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("404 Not Found");
                    return;
                }
                res.writeHead(200, { "Content-Type": mimeTypes[ext] });
                res.end(data);
            });
            
        }else{
            const [folder, file] = pageRoutes[matchedUrl];
            const filePath = path.join(__dirname, "../Presentation", folder, file);
            
            fs.readFile(filePath, (err, data) => {
                if(err){
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("404 Not Found");
                    return;
                }
                
                res.writeHead(200, { "Content-Type": mimeTypes[".html"] });
                res.end(data);
                logger.info(`Move ${req.method}, ${req.url}`);
            });
        }
    }

    // 정적 파일 제공
    if (pageRoutes[pathUrl] && !pathUrl.includes("/detail")) {
        const [folder, file] = pageRoutes[pathUrl];
        const filePath = path.join(__dirname, "../Presentation", folder, file);
        
        fs.readFile(filePath, (err, data) => {
            if(err){
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 Not Found");
                return;
            }
            res.writeHead(200, { "Content-Type": mimeTypes[".html"] });
            res.end(data);
            logger.info(`Move ${req.method}, ${req.url}`);
        });
    }

    const ext = path.extname(pathUrl);
    if(ext && !pathUrl.includes("/detail")){
        const segments = pathUrl.split("/");
        const folder = segments[1];
        const restPath = segments.slice(2).join("/");
        const filePath = path.join(__dirname, "../Presentation", folder, restPath);

        fs.readFile(filePath, (err, data) => {
            if(err){
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 Not Found");
                return;
            }
            res.writeHead(200, { "Content-Type": mimeTypes[ext] });
            res.end(data);
        });
    }

    if (method === "GET" && pathUrl === "/api/userlist/search"){
        logger.info(`Start ${req.method}, ${req.url}`);
        setCorsHeaders(res);
        verifyToken(req)
        .then(user => {
            const {task_manage, user_manage, name} = parsedUrl.query;

            let conditions = [];
            let values = [];
            let querys = '';
            let querysJoin = '';
    
            if(task_manage !== '' || user_manage !== '' || name !== ''){
                if(task_manage === '' && user_manage === ''){
                    conditions.push(`last_name ILIKE $1`);
                    values.push(name + '%');
                    conditions.push(`first_name ILIKE $2`);
                    values.push(name + '%');
                    querysJoin = conditions.join(" OR ");
                }else if(task_manage === '' && name === ''){
                    conditions.push(`user_manage_right = $1`);
                    values.push(user_manage);
                    querysJoin = conditions.join(" AND ");
                }else if(name === '' && user_manage === ''){
                    conditions.push(`task_delete_right = $1`);
                    values.push(task_manage);
                    querysJoin = conditions.join(" AND ");
                }else if(task_manage === ''){
                    conditions.push(`last_name ILIKE $1`);
                    values.push(name + '%');
                    conditions.push(`first_name ILIKE $2`);
                    values.push(name + '%');
                    conditions = [`(${conditions.join(" OR ")})`];
    
                    conditions.push(`user_manage_right = $3`);
                    values.push(user_manage);
                    querysJoin = conditions.join(" AND ");
                }else if(user_manage === ''){
    
                    conditions.push(`last_name ILIKE $2`);
                    values.push(name + '%');
                    conditions.push(`first_name ILIKE $3`);
                    values.push(name + '%');
                    conditions = [`(${conditions.join(" OR ")})`];
    
                    conditions.push(`task_delete_right = $1`);
                    values.push(task_manage);
                    querysJoin = conditions.join(" AND ");
    
                }else if(name === ''){
                    conditions.push(`task_delete_right = $1`);
                    values.push(task_manage);
                    conditions.push(`user_manage_right = $2`);
                    values.push(user_manage);
                    querysJoin = conditions.join(" AND ");
                }else{
    
                    conditions.push(`last_name ILIKE $1`);
                    values.push(name + '%');
                    conditions.push(`first_name ILIKE $2`);
                    values.push(name + '%');
                    conditions = [`(${conditions.join(" OR ")})`];
                    
                    conditions.push(`task_delete_right = $3`);
                    values.push(task_manage);
                    conditions.push(`user_manage_right = $4`);
                    values.push(user_manage);
                    querysJoin = conditions.join(" AND ");
                    
                }
            }
    
            
    
            if(querysJoin !== ''){
                querys = `
                    SELECT * FROM users
                    WHERE ${querysJoin}
                `;
            }else{
                querys = "SELECT * FROM users";
            }
            db.query(querys, values, (err, result) => {
                if(err){
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Internal Server Error" }));
                    logger.error(`End   ${req.method}, ${req.url}, internal-server-error ${user}`);
                    return;
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(result.rows));
                logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
                return;
            });
        })
        .catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        });
        return;
    }


    if (method === "POST" && pathUrl === "/api/userlist"){
        setCorsHeaders(res);
        verifyToken(req, true)
        .then(user => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const userData = JSON.parse(body);
                    const checkEmail = async () => {
                        for(let i = 0; i < userData.length; i++) {
                            if(userData[i].subject === 'email_address') {
                                const result = await db.query(
                                    "SELECT * FROM users WHERE email_address = $1", 
                                    [userData[i].value]
                                );
                                
                                if(result.rows.length > 0) {
                                    throw new Error("既に同じメールアドレスが存在します");
                                }
                            }
                        }
                    };

                    // 이메일 중복 확인 실행
                    await checkEmail();

    
                    for(let i = 0; i < userData.length; i++){
                        if(userData[i].subject === 'password'){
                            const hashedPassword = await bcrypt.hash(userData[i].value, saltRounds);
                            userData[i].value = hashedPassword;
                        }
                    }
    
                    const query = []
                    const value = []
                    userData.forEach(user => {
                        query.push(`UPDATE users SET ${user.subject} = $1 WHERE user_id = ${user.id}`);
                        value.push(user.value);
                    });
    
                    async function updateUser(querys, values){
    
                        try{
                            await db.query("BEGIN");
    
                            querys.forEach(async (query, index) => {
                                await db.query(`${query}`, [values[index]]);
                            });
    
                            await db.query("COMMIT");
                        }catch(error){
                            await db.query("ROLLBACK");
                            throw error;
                        }
                    }
    
                    await updateUser(query, value);
    
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "更新しました" }));
                    logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
                    return;
                } catch (error) {
                    if(error.message === "既に同じメールアドレスが存在します"){
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "既に同じメールアドレスが存在します" }));
                        logger.info(`End   ${req.method}, ${req.url}, already-exist-email ${user}`);
                        return;
                    }else{
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: "Invalid JSON" }));
                        logger.info(`End   ${req.method}, ${req.url}, invalid-json ${user}`);
                        return;
                    }
                }
            })
        })
        .catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        });
        return;
    }

    if (method === "POST" && pathUrl === "/sendmail"){
        setCorsHeaders(res);
        verifyToken(req)
        .then(user => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const mailData = JSON.parse(body);
                    const mailOptions = {
                        from: process.env.GMAIL_USER,
                        to: mailData.to,
                        subject: '課題管理システム課題依頼',
                        text: `課題依頼されたページは以下のURLです。\n${mailData.pageUrl}\n\n依頼メッセージ：\n${mailData.to}`
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            res.writeHead(404, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ error: "メール送信に失敗しました" }));
                            logger.info(`End   ${req.method}, ${req.url}, failed-to-send-mail ${user}`);
                            return;
                        } else {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify({ message: "メールを送信しました" }));
                            logger.info(`End   ${req.method}, ${req.url}, success ${user}`);
                            return;
                        }
                    });
                } catch (error) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid JSON" }));
                    logger.info(`End   ${req.method}, ${req.url}, invalid-json ${user}`);
                    return;
                }
            });

        })
        .catch(error => {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unauthorized" }));
            logger.info(`${req.method}, ${req.url}, unauthorized-request`);
            return;
        });
        return;
    }
});




const PORT = 5500;
server.listen(PORT, ipAddress || 'unknown', () => {
    logger.info(`server is running on port ${PORT} and ip address ${ipAddress}\n can access from http://${ipAddress}:5500/login`);
});

// 서버 에러 핸들링
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        logger.fatal(`port ${PORT} is already in use`);
    } else {
        logger.fatal({error}, "server error");
    }
});

// 프로세스 에러 핸들링
process.on('uncaughtException', (error) => {
    logger.fatal({error}, "uncaughtException");
});

process.on('unhandledRejection', (reason, promise) => {
    logger.fatal({reason, promise}, "unhandledRejection");
});

process.on('SIGTERM', () => {
    logger.info("disconnect server");
    server.close(() => {
        logger.info('server connection closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info("disconnect server");
    server.close(() => {
        logger.info('server connection closed');
        process.exit(0);
    });
});

