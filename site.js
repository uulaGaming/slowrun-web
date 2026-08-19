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
import * as path from "node:path";

/* declare server constants */
const hostname = '127.0.0.1';
const port = 8080;

const STATICPATH = path.join(process.cwd(), "./static");

/* yes this is stolen from mdn */
const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "text/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

/* function for reading a file and sending it as a response */
function respondFile(file, res){
}

/* make the server with with a handler function */
const server = http.createServer((req, res) => {

	res.statusCode = 200;

	const url = req.url;

	/* check the requested page */
	switch(url){

		case "/test":
			res.setHeader("Content-Type","text/html");
			res.write("<h1>mega swagballs</h1>");
			res.end("<p>yuhuh</p>");
			break;

		/* oops */
		default:
			try{
				/* look for file */
				let filepath = STATICPATH;
				filepath += decodeURI(url);
				if (url == "/") filepath += "index.html";
				const ext = path.extname(filepath).substring(1).toLowerCase();
				const mtype = MIME_TYPES[ext] || MIME_TYPES.default;
				res.setHeader("Content-Type",mtype);
				res.write(fs.readFileSync(filepath, 'utf8'));
				res.end();
			} catch(err){
				/* there was no file */
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
