import axios from "axios";
import React from "react";
import { host } from "../utils/data";
import { toast } from "react-toastify";

const ListItem = ({ slug, gitUrl ,fetchProjects,url}) => {

  const deleteProject = async () => {
      const {data} = await axios.delete(`${host}/project/deleteOne`,{
        headers: {
          'auth-token': localStorage.getItem('auth-token'),
          'Content-Type': 'application/json'
        },
        data: {slug}
      });
      if(!data.success){
        toast.error(data.error)
      }
      else{
        toast.success(data.msg);
        fetchProjects();
      }
  }

  return (
    <div className="w-3/4 h-20 bg-gray-500 rounded-md flex justify-center items-center">
      <h3 className="text-xl font-bold flex-1 flex justify-center items-center">
        {slug}
      </h3>
      <h3 className="text-xl font-bold flex-1 flex justify-center items-center">
        <a href={`http://${url}`} target="_blank" >{url}</a>
      </h3>
      <div className="flex justify-center items-center gap-4 flex-1">
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 transition ease-in-out delay-75 hover:bg-blue-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110">
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
          Re-Delpoy
        </button>
        <button onClick={deleteProject} className="inline-flex items-center px-4 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-110">
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
