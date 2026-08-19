/*
**  site.js
**
** awesome swaggy backend for a
** stupid fake site
**
*/

/* import this shit */
import * as http from "node:http";
import * as fs from "node:fs";

/* declare server constants */
const hostname = '127.0.0.1';
const port = 8080;

/* function for reading a file and sending it as a response */
function respondFile(file, res){
}

/* make the server with with a handler function */
const server = http.createServer((req, res) => {

	res.statusCode = 200;

	/* check the requested page */
	switch(req.url){

		case "test":
			res.setHeader("Content-Type","text/html");
			res.write("<h1>mega swagballs</h1>");
			res.end("<p>yuhuh</p>");
			break;

		/* oops */
		default:
			try{
				const data = fs.readFileSync("index.html", 'utf8');
				res.write(data);
				res.end();
			} catch(err){
				console.log(err);
				res.statusCode = 404;
				res.setHeader("Content-Type","text/plain");
				res.end("idk man");
			}
			break;
	}
});

/* start the server */
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
