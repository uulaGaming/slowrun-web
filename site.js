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
	ttf: "font/ttf",
};

/* make the server with with a handler function */
const server = http.createServer((req, res) => {

	res.statusCode = 200;

	const urlparams = req.url.split('?');
	const url = urlparams[0];

	/* check the requested page */
	switch(url){

		case "/test":
			res.setHeader("Content-Type","text/html");
			res.write("<h1>mega swagballs</h1>");
			res.end("<p>yuhuh</p>");
			break;

		case "/news":
			res.setHeader("Content-Type","text/html");
			if(urlparams.length < 2){
				res.write('<link rel="stylesheet" href="style.css">');
				res.write('<meta charset="utf-8">');
				res.write('<header><h1><a href="/">SLOW RUN</a></h1> <nav> <a href="/news">Uutiset</a> <a href="/contact.html">Ota yhteyttä</a></nav></header>');
				res.write('<main class="newslist">');
				res.write('<h1>Uutiset</h1>');
				const articles = fs.readdirSync('news').reverse();
				for(const article of articles){
					const content = fs.readFileSync('news/'+article,{encoding: 'utf8'}).split('\n');
					res.write('<a href="news?'+article+'">');
					res.write("<article>");
					res.write("<h1>"+content[0]+"</h1>");
					res.write("<pre>"+content[1]+"</pre>");
					res.write("</article>");
					res.write("</a>");
				}
				res.write('</main>');
			}
			res.end();
			break;

		case "/infosend.html":
			let data = '';
			if(req.method === 'POST'){
				req.on('data', chunk => {
					data += chunk.toString();
				});
			}
			req.on('end', () => {
				const sdata = data.split('&');
				let rdata = '';
				for(const line of sdata){
					rdata += decodeURIComponent(line.replaceAll('+', ' '));
					rdata += "\n";
				}
				const t = new Date;

				fs.writeFileSync('messages/' + t.toISOString() + '.txt', rdata);
				res.end('Viestisi on tallennettu');
			});
			break;

		/* oops */
		default:
			let filepath = STATICPATH;
			filepath += decodeURI(url);
			if (url == "/") filepath += "index.html";
			const ext = path.extname(filepath).substring(1).toLowerCase();
			const mtype = MIME_TYPES[ext] || MIME_TYPES.default;
			if(fs.existsSync(filepath)){
				res.writeHead(200, {"Content-Type": mtype});
				const stream = fs.createReadStream(filepath);
				stream.pipe(res);
			} else {
				/* there was no file */
				/* okay good enough */
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
