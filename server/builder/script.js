const { exec } = require("child_process");

const init = async () => {
  console.log("Executing script.js");

  const dirPath = path.join(__dirname, "project");

  const output = exec(`cd ${dirPath} && npm install && npm run build`);

  output.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  output.stderr.on("error", (data) => {
    console.log("Error -> ", data.toString());
  });

  output.on("close", async () => {
    console.log("Build Complete");
  });
};
