const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const EventEmitter = require("events");

const PORT = 3000;

const FILE_NAME = path.join(__dirname, "data.txt");


// ==========================================
// CUSTOM EVENT EMITTER
// ==========================================

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();


// GREET EVENT
myEmitter.on("greet", (name) => {

    console.log(`Hello ${name}!`);
});


// EXIT EVENT
myEmitter.on("exit", () => {

    console.log("Exit event triggered");
});


// ==========================================
// HELPER FUNCTION
// ==========================================

function sendJSON(res, statusCode, data) {

    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));
}


// ==========================================
// CREATE SERVER
// ==========================================

const server = http.createServer((req, res) => {

    const parsedUrl =
        url.parse(req.url, true);

    const pathname =
        parsedUrl.pathname;

    const query =
        parsedUrl.query;


    console.log(
        `${req.method} ${pathname}`
    );


    // ======================================
    // SERVE INDEX.HTML
    // ======================================

    if (
        pathname === "/" &&
        req.method === "GET"
    ) {

        fs.readFile(
            path.join(__dirname, "index.html"),
            "utf8",
            (err, data) => {

                if (err) {

                    res.writeHead(500, {
                        "Content-Type": "text/plain"
                    });

                    res.end(
                        "Error loading index.html"
                    );

                    return;
                }


                res.writeHead(200, {
                    "Content-Type": "text/html"
                });

                res.end(data);
            }
        );

        return;
    }


    // ======================================
    // GREET EVENT
    // ======================================

    if (
        pathname === "/greet" &&
        req.method === "GET"
    ) {

        const name =
            query.name || "Guest";


        myEmitter.emit("greet", name);


        sendJSON(res, 200, {

            success: true,

            event: "greet",

            message:
                `Hello ${name}!`,

            name: name
        });

        return;
    }


    // ======================================
    // EXIT EVENT
    // ======================================

    if (
        pathname === "/exit" &&
        req.method === "GET"
    ) {

        myEmitter.emit("exit");


        sendJSON(res, 200, {

            success: true,

            event: "exit",

            message:
                "Exit event triggered successfully"
        });

        return;
    }


    // ======================================
    // EVENT LOOP
    // ======================================

    if (
        pathname === "/eventloop" &&
        req.method === "GET"
    ) {

        const order = [];


        order.push("1. Synchronous code");


        process.nextTick(() => {

            order.push(
                "2. process.nextTick"
            );
        });


        Promise.resolve().then(() => {

            order.push(
                "3. Promise microtask"
            );
        });


        setTimeout(() => {

            order.push(
                "4. setTimeout"
            );

        }, 0);


        setImmediate(() => {

            order.push(
                "5. setImmediate"
            );
        });


        setTimeout(() => {

            sendJSON(res, 200, {

                success: true,

                order: order
            });

        }, 50);


        return;
    }


    // ======================================
    // CREATE FILE
    // ======================================

    if (
        pathname === "/create" &&
        req.method === "POST"
    ) {

        let body = "";


        req.on("data", (chunk) => {

            body += chunk;
        });


        req.on("end", () => {

            try {

                const data =
                    JSON.parse(body);

                const text =
                    data.text || "";


                fs.writeFile(
                    FILE_NAME,
                    text,
                    "utf8",
                    (err) => {

                        if (err) {

                            sendJSON(
                                res,
                                500,
                                {
                                    success: false,
                                    message:
                                        "File creation failed",
                                    error:
                                        err.message
                                }
                            );

                            return;
                        }


                        sendJSON(
                            res,
                            200,
                            {
                                success: true,
                                message:
                                    "File created successfully",
                                content:
                                    text
                            }
                        );
                    }
                );

            } catch (error) {

                sendJSON(
                    res,
                    400,
                    {
                        success: false,
                        message:
                            "Invalid JSON"
                    }
                );
            }
        });

        return;
    }


    // ======================================
    // READ FILE
    // ======================================

    if (
        pathname === "/read" &&
        req.method === "GET"
    ) {

        fs.readFile(
            FILE_NAME,
            "utf8",
            (err, data) => {

                if (err) {

                    sendJSON(
                        res,
                        404,
                        {
                            success: false,
                            message:
                                "File does not exist"
                        }
                    );

                    return;
                }


                sendJSON(
                    res,
                    200,
                    {
                        success: true,
                        message:
                            "File read successfully",
                        content:
                            data
                    }
                );
            }
        );

        return;
    }


    // ======================================
    // UPDATE FILE
    // ======================================

    if (
        pathname === "/update" &&
        req.method === "PUT"
    ) {

        let body = "";


        req.on("data", (chunk) => {

            body += chunk;
        });


        req.on("end", () => {

            try {

                const data =
                    JSON.parse(body);

                const text =
                    data.text || "";


                fs.appendFile(
                    FILE_NAME,
                    "\n" + text,
                    "utf8",
                    (err) => {

                        if (err) {

                            sendJSON(
                                res,
                                500,
                                {
                                    success: false,
                                    message:
                                        "File update failed",
                                    error:
                                        err.message
                                }
                            );

                            return;
                        }


                        sendJSON(
                            res,
                            200,
                            {
                                success: true,
                                message:
                                    "File updated successfully",
                                added:
                                    text
                            }
                        );
                    }
                );

            } catch (error) {

                sendJSON(
                    res,
                    400,
                    {
                        success: false,
                        message:
                            "Invalid JSON"
                    }
                );
            }
        });

        return;
    }


    // ======================================
    // DELETE / CLEAR FILE
    // ======================================

    if (
        pathname === "/delete" &&
        req.method === "DELETE"
    ) {

        fs.writeFile(
            FILE_NAME,
            "",
            "utf8",
            (err) => {

                if (err) {

                    sendJSON(
                        res,
                        500,
                        {
                            success: false,
                            message:
                                "File clearing failed"
                        }
                    );

                    return;
                }


                sendJSON(
                    res,
                    200,
                    {
                        success: true,
                        message:
                            "File content cleared successfully"
                    }
                );
            }
        );

        return;
    }


    // ======================================
    // 404
    // ======================================

    sendJSON(
        res,
        404,
        {
            success: false,
            message:
                "Route not found"
        }
    );

});


// ==========================================
// START SERVER
// ==========================================

server.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );
    }
);