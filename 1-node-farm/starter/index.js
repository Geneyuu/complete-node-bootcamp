const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const productData = JSON.parse(data);

const slugs = productData.map((el) => slugify(el.productName, { lower: true }));

console.log(slugs);

const tempOverview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	"utf-8",
);

const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	"utf-8",
);

const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	"utf-8",
);

const server = http.createServer((req, res) => {
	const { pathname, query } = url.parse(req.url, true);

	console.log(pathname);
	console.log(query);

	if (pathname === "/" || pathname === "/overview") {
		res.writeHead(200, { "content-type": "text/html" });

		const cardsHtml = productData
			.map((el) => replaceTemplate(tempCard, el))
			.join("");
		const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

		res.end(output);
	} else if (pathname === "/product") {
		const id = query.id;
		const product = productData[id];

		console.log(id);
		console.log(product);

		if (product) {
			res.writeHead(200, { "content-type": "text/html" });
			const output = replaceTemplate(tempProduct, product);
			res.end(output);
		} else {
			res.writeHead(404, { "Content-Type": "text/html" });
			res.end("<h1>Product not found!</h1>");
		}
		// API
	} else if (pathname === "/api") {
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify(productData));

		// 404 PAGE
	} else {
		res.writeHead(404, { "Content-Type": "text/html" });
		res.end("<h1>Page not found!</h1>");
	}
});

server.listen(8000, "127.0.0.1", () => {
	console.log("Listening on port 8000");
});
