import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { host } from "../utils/data";
import { toast } from "react-toastify";
import TopBar from "../components/TopBar";
import ListItem from "../components/ListItem";
import { io } from "socket.io-client";

const socket = io("http://localhost:9002");

const isValid = (str) => {
  let regex = new RegExp(
    /((http|git|ssh|http(s)|file|\/?)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:/\-~]+)(\.git)(\/)?/
  );
  if (str == null) {
    return false;
  }
  if (regex.test(str) == true) {
    return true;
  } else {
    return false;
  }
};

const Home = () => {
  let navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/auth");
    } else {
      fetchProjects();
    }
  }, []);

  const arrows = ">>";

  const redeploy = async (slug) => {
    toast.info("Redeploy Started");
    const { data } = await axios.post(
      `${host}/project/redeploy`,
      { slug },
      {
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
      }
    );
    console.log(data);
    if (!data.success) {
      toast.error(data.error);
    } else {
      setprocess("deploying");
      socket.emit("subscribe", `logs:${slug}`);
    }
  };

  const fetchProjects = async () => {
    const { data } = await axios.get(`${host}/project/getAll`, {
      headers: {
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
    });
    if (!data.success) {
      toast.error(data.error);
    } else {
      setprojects(data.projects);
    }
  };

  const [slug, setslug] = useState("");
  const [gitUrl, setgitUrl] = useState("");
  const [process, setprocess] = useState("idle");
  const [projects, setprojects] = useState([]);
  const [logs, setlogs] = useState(["Getting ready to deploy..."]);

  const handleLogs = useCallback((message) => {
    const { log } = JSON.parse(message);
    setlogs((prevLogs) => [log, ...prevLogs]);
    if (log.includes("Deploy completed Successfully!")) {
      toast.success("Deploy Completed 🎉");
      setTimeout(() => {
        fetchProjects();
        setprocess("idle");
        setlogs(["Getting ready to deploy..."]);
        setslug("");
        setgitUrl("");
      }, 3000);
    }
  }, []);

  useEffect(() => {
    socket.on("message", handleLogs);
    return () => {
      socket.off("message", handleLogs);
    };
  }, [handleLogs]);

  const deploy = async () => {
    if (!isValid(gitUrl)) {
      return toast.error("Invalid Git URL");
    }
    toast.info("Deploy Started");
    const { data } = await axios.post(
      `${host}/project/deploy`,
      { slug, gitUrl },
      {
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
      }
    );
    console.log(data);
    if (!data.success) {
      toast.error(data.error);
    } else {
      setprocess("deploying");
      socket.emit("subscribe", `logs:${slug}`);
    }
  };

  return (
    <>
      <TopBar />
      <div className="mt-10 flex flex-col justify-center items-center">
        <div className="h-1/2 flex justify-center items-center">
          <div className="w-96 rounded-2">
            {process === "idle" ? (
              <div className="mcon flex flex-col gap-6 p-8">
                <input
                  placeholder="Slug"
                  className="inp w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-100"
                  value={slug}
                  onChange={(e) => {
                    setslug(e.target.value);
                  }}
                />
                <input
                  placeholder="Git Repositry URL"
                  className="inp w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-100"
                  value={gitUrl}
                  onChange={(e) => {
                    setgitUrl(e.target.value);
                  }}
                />

                <button
                  onClick={deploy}
                  className="w-40 mx-auto bbt inline-block cursor-pointer rounded-md px-4 py-3.5 text-center text-sm font-semibold uppercase transition duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 active:scale-95"
                >
                  <h2 className=" font-bold text-lg">Deploy</h2>
                </button>
              </div>
            ) : (
              <>
                <div className="mcon w-96 h-80 rounded-lg">
                  <h2 className="text-2xl font-bold text-white text-center p-4">
                    View Logs Here
                  </h2>
                  <div class="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-orange-600 mx-auto mb-2"></div>
                  <div className="logs text-white text-lg font-semibold pl-5 pt-2 h-3/4 overflow-y-auto">
                    {logs.map((log, index) => {
                      return (
                        <p key={index}>
                          {arrows} {log}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="h-50 w-full flex flex-col gap-8 mt-10 justify-center items-center">
          <h2 className="text-gray-200 text-3xl font-bold">Projects</h2>
          { projects.length==0?<h3 className="text-gray-400 text-xl">No Projects Deployed</h3>:projects.map((project) => {
            return (
              <ListItem
                key={project._id}
                slug={project.slug}
                gitUrl={project.gitUrl}
                url={`${project.slug}.localhost:5000`}
                fetchProjects={fetchProjects}
                process={process}
                redeploy={redeploy}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
