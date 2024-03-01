import axios from "axios";
import React from "react";
import { host } from "../utils/data";
import { toast } from "react-toastify";

const ListItem = ({ slug, gitUrl, fetchProjects, url, redeploy, process }) => {
  const deleteProject = async () => {
    const { data } = await axios.delete(`${host}/project/deleteOne`, {
      headers: {
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      data: { slug },
    });
    if (!data.success) {
      toast.error(data.error);
    } else {
      toast.success(data.msg);
      fetchProjects();
    }
  };

  return (
    <div className="w-2/4 h-20 lss text-gray-200 rounded-md flex justify-evenly">
      <h3 className="text-xl font-bold  flex justify-center items-center w-20">
        {slug}
      </h3>
      <h3 className="text-xl font-bold  flex justify-center items-center">
        <a href={`http://${url}`} target="_blank">
          <svg
            class="h-8 w-8 text-gray-200 hover:-translate-y-1 hover:scale-110  hover:text-orange-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.7"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        </a>
      </h3>
      <h3 className="text-xl font-bold  flex justify-center items-center">
        <a href={gitUrl} target="_blank">
          <svg
            class="h-7 w-7 text-gray-200 hover:-translate-y-1 hover:scale-110 hover:text-orange-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            {" "}
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
      </h3>
      <div className="flex justify-center items-center gap-3 ">
        <button
          disabled={process !== "idle" ? true : false}
          onClick={() => redeploy(slug)}
          className="inline-flex items-center px-4 py-2 border-2 border-blue-600 transition ease-in-out delay-75 hover:bg-blue-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110"
        >
          Re-Delpoy
        </button>
        <button
          disabled={process !== "idle" ? true : false}
          onClick={deleteProject}
          className="inline-flex items-center px-4 py-2 border-2 border-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110"
        >
          <svg
            stroke="currentColor"
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ListItem;
