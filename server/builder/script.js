const path = require("path");
const { exec } = require("child_process");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const mime = require("mime-types");
const Redis = require('ioredis')

const pub = new Redis(process.env.REDIS_URI)

const PROJECT_ID = process.env.PROJECT_ID

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function pubLog(log) {
  pub.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log }))
}


const init = async () => {
  console.log("Executing script.js");
  pubLog('Build started ... ');
  const dirPath = path.join(__dirname, "project");

  const output = exec(`cd ${dirPath} && npm install && npm run build`);

  output.stdout.on("data", (data) => {
    console.log(data.toString());
    pubLog(data.toString());
  });

  output.stderr.on("error", (data) => {
    console.log("Error -> ", data.toString());
    pubLog(`Error -> ${data.toString()}`);
  });

  output.on("close", async () => {
    console.log("Build Complete");
    pubLog('Build completed successfully!');
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
      
      pubLog(`Uploaded ${file}`);

    }

    console.log("Upload Completed Successfully");
    pubLog("Deploy completed Successfully!")

  });
};

init();
