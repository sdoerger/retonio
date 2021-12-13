import fs from "fs";

function createContent() {
  return `retonio:
	node node_modules/retonio/make-retonio.mjs js false	$(filter-out $@,$(MAKECMDGOALS))`;
}

function createFile(path) {
  // ONLY if file does not exisit
  fs.writeFile("Makefile", createContent(), { flag: "wx" }, function (err) {
    if (err) {
      console.log("Error");
      return console.log(`Makefile already exists!`);
    }
    return console.log(`Makefile was created.`);
  });
}

createFile();