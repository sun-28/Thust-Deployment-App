const router = require("express").Router();
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const TProject = require("../models/TProject");
const authenticate = require("../middleware/authenticate");

const ecsClient = new ECSClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const config = {
  CLUSTER: process.env.CLUSTER,
  TASK: process.env.TASK,
};

router.post("/deploy", authenticate, async (req, res) => {
  try {
    const { slug, gitUrl } = req.body;
    const userId = req.userId;

    const project = await TProject.findOne({ slug });

    if (project) {
      return res.json({ success: false, error: "slug already exists" });
    }

    const command = new RunTaskCommand({
      cluster: config.CLUSTER,
      taskDefinition: config.TASK,
      launchType: "FARGATE",
      count: 1,
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "ENABLED",
          subnets: [process.env.SN_1, process.env.SN_2, process.env.SN_3],
          securityGroups: [process.env.SG],
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: "builder-image",
            environment: [
              { name: "GIT_REPO_URL", value: gitUrl },
              { name: "PROJECT_ID", value: slug },
              { name: "AWS_ACCESS_KEY", value: process.env.AWS_ACCESS_KEY },
              {
                name: "AWS_SECRET_ACCESS_KEY",
                value: process.env.AWS_SECRET_ACCESS_KEY,
              },
              { name: "REDIS_URI", value: process.env.REDIS_URI },
            ],
          },
        ],
      },
    });

    await ecsClient.send(command);

    await TProject.create({ gitUrl, slug, userId });
    return res.json({
      status: "queued",
      data: { slug, url: `http://${slug}.${process.env.HOST_URL}` },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: "internal server error" });
  }
});

router.post("/redeploy", authenticate, async (req, res) => {
  try {
    const { slug } = req.body;
    const userId = req.userId;

    const project = await TProject.findOne({ slug, userId });

    if (!project) {
      return res.json({ success: false, error: "project not found!" });
    }

    const gitUrl = project.gitUrl;

    const command = new RunTaskCommand({
      cluster: config.CLUSTER,
      taskDefinition: config.TASK,
      launchType: "FARGATE",
      count: 1,
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "ENABLED",
          subnets: [process.env.SN_1, process.env.SN_2, process.env.SN_3],
          securityGroups: [process.env.SG],
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: "builder-image",
            environment: [
              { name: "GIT_REPO_URL", value: gitUrl },
              { name: "PROJECT_ID", value: slug },
              { name: "AWS_ACCESS_KEY", value: process.env.AWS_ACCESS_KEY },
              {
                name: "AWS_SECRET_ACCESS_KEY",
                value: process.env.AWS_SECRET_ACCESS_KEY,
              },
              { name: "REDIS_URI", value: process.env.REDIS_URI },
            ],
          },
        ],
      },
    });

    await ecsClient.send(command);

    return res.json({
      status: "queued",
      data: { slug, url: `http://${slug}.${process.env.HOST_URL}` },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: "internal server error" });
  }
});

router.get("/getprojects", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const projects = await TProject.find({ userId });
    return res.json({ success: true, projects });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: "internal server error" });
  }
});

router.delete("/deletepoject", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { slug } = req.body;

    const project = await TProject.findOneAndDelete({ slug, userId });

    if (!project) {
      return res.json({ success: false, error: "Project Not Found" });
    }
    res.json({ success: true, msg: "Project Deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: "internal server error" });
  }
});

module.exports = router;
