const path = require("path");
const { exec } = require("child_process");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const mime = require("mime-types");

const PROJECT_ID = process.env.PROJECT_ID

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


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
    const distPath = path.join(__dirname, "project", "dist");
    const distContent = fs.readdirSync(distPath, { recursive: true });

    for (const file of distContent) {
      const fPath = path.join(distPath, file);

      if (fs.lstatSync(fPath).isDirectory()) continue;

      const command = new PutObjectCommand({
        Bucket: "thrust-deployment",
        Key: `builds/${PROJECT_ID}/${file}`,
        Body: fs.createReadStream(fPath),
        ContentType: mime.lookup(fPath),
      });

      await s3Client.send(command);

      console.log("Uploaded ", fPath);
    }

    console.log("Upload Completed Successfully");
  });
};

init();
