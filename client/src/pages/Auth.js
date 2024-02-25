import React, { useState , useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { host } from "../utils/data";
import { toast } from "react-toastify";

const Auth = () => {
  let navigate = useNavigate();

  const [authType, setauthType] = useState("login");
  const [cred, setcred] = useState({ username: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      navigate("/");
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(`${host}/auth/${authType}`, cred);
    if (data.success) {
      localStorage.setItem("auth-token", data.token);
      navigate("/");
      toast.success(`${authType} successful!`);
    } else {
      toast.error(data.error);
    }
  };
  const onchange = (e) => {
    setcred({ ...cred, [e.target.name]: e.target.value });
  };
  return (
    <>
      <div className="h-full flex flex-col gap-10 items-center justify-center ">
        
        <div className=" flex gap-10 justify-center items-center">
        <h2 className="text-center text-2xl font-bold mr-4 text-gray-800">Login</h2>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" defaultValue="" className="sr-only peer" />
          <div onClick={()=>{authType==='login'?setauthType('signup'):setauthType('login')}} className="peer ring-2 ring-gray-900 bg-gradient-to-r from-rose-400 to-red-900 rounded-xl outline-none duration-300 after:duration-500 w-20 h-6  shadow-inner peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900 shadow-gray-900 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-900  after:content-[''] after:rounded-2xl after:absolute after:outline-none after:h-10 after:w-10 after:bg-gray-50 after:-top-2 after:-left-2 after:flex after:justify-center after:items-center after:border-4 after:border-gray-900  peer-checked:after:translate-x-14"></div>
        </label>
        <h2 className="text-center text-2xl font-bold text-gray-800">Register</h2>
        </div>

        <div className="relative">
          <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg animate-pulse" />
          <div
            id="form-container"
            className="bg-white p-16 rounded-lg shadow-2xl w-80 relative z-10 transform transition duration-500 ease-in-out"
          >
            <h2
              id="form-title"
              className="text-center text-3xl font-bold mb-10 text-gray-800"
            >
              {authType === "login" ? "Login" : "Register"}
            </h2>
            <form className="space-y-5">
              <input
                className="w-full h-12 border border-gray-800 px-3 rounded-lg"
                placeholder="Username"
                name="username"
                type="text"
                value={cred.username}
                onChange={onchange}
              />
              <input
                className="w-full h-12 border border-gray-800 px-3 rounded-lg"
                placeholder="Password"
                name="password"
                type="password"
                value={cred.password}
                onChange={onchange}
              />
              <button
                onClick={handleSubmit}
                className="w-full h-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {authType === "login" ? "Sign in" : "Sign up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
