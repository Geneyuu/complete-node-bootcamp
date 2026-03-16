const { error } = require("console");
const fs = require("fs");
const http = require("http");
const url = require("url");

//////////////////////////////////////
// FILES

// this is example of blocking, synchrounous wey
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// const textOut = `this is a what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);

// console.log("File written");

// this is example of non -blocking, asynchronous way
// fs.readFile("./txt/st
// sole.log("Error data 1");
// 	fs.readFile(`./txt/${data1}.txt`, "utf-8", (error, data2) => {
// 		console.log(data2);
// 		fs.readFile(`./txt/append.txt`, "utf-8", (error, data3) => {
// 			console.log(data3);

// 			fs.writeFile(
// 				"./txt/final.txt",
// 				`${data2}\n${data3} testomggggg`,
// 				"utf-8",
// 				(error) => {
// 					console.log("Your file has been written");
// 				},
// 			);
// 		});
// 	});
// });

// console.log("Will Read File...");

// SERVER

// -------------------- TEMPLATE HELPER --------------------
const replaceTemplate = (temp, product) => {
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
	output = output.replace(/{%IMAGE%}/g, product.image);
	output = output.replace(/{%PRICE%}/g, product.price);
	output = output.replace(/{%FROM%}/g, product.from);
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
	output = output.replace(/{%QUANTITY%}/g, product.quantity);
	output = output.replace(/{%DESCRIPTION%}/g, product.description);
	output = output.replace(/{%ID%}/g, product.id);

	// Optional: add a class if product is not organic
	if (!product.organic) {
		output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
	} else {
		output = output.replace(/{%NOT_ORGANIC%}/g, "");
	}

	return output;
};

// -------------------- READ FILES ONCE --------------------
const tempOverview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	"utf-8",
);
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	"utf-8",
);
const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	"utf-8",
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productData = JSON.parse(data);

// -------------------- START SERVER --------------------
const server = http.createServer((req, res) => {
	const { pathname, query } = url.parse(req.url, true);

	// OVERVIEW PAGE
	if (pathname === "/" || pathname === "/overview") {
		res.writeHead(200, { "Content-Type": "text/html" });

		const cardsHtml = productData
			.map((el) => replaceTemplate(tempCard, el))
			.join("");
		const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

		res.end(output);

		// PRODUCT PAGE
	} else if (pathname === "/product") {
		const id = query.id;
		const product = productData[id];

		if (product) {
			res.writeHead(200, { "Content-Type": "text/html" });
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

// -------------------- LISTEN --------------------
server.listen(8000, "127.0.0.1", () => {
	console.log("Listening on port 8000");
});
