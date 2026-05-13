import React, { useState } from "react";
import Victory from "../../assets/victory.svg";
import Background from "../../assets/login2.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "@/redux/slices/authSlice";
import { backend_url } from "@/assets/constants";

const AuthPage = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Auth = useSelector((state) => state.Auth.userInfo);

  const validateSignup = () => {
    if (!email) {
      toast.error("Email is Required");
      return false;
    }
    if (!password) {
      toast.error("Password is Required");
      return false;
    }
    if (!confirmPassword) {
      toast.error("Confirm password is Required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("password and confirm password does not match");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email) {
      toast.error("Email is Required");
      return false;
    }
    if (!password) {
      toast.error("Password is Required");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    try {
      if (validateLogin()) {
        const response = await backend_url.post(`/user/login`, {
          email,
          password,
        });
        if (response.data.userdata._id) {
          dispatch(setUserInfo(response.data.userdata));
          localStorage.setItem("authtoken", response.data.token);

          if (response.data.userdata.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleSignup = async () => {
    try {
      if (validateSignup()) {
        const response = await backend_url.post(`user/signup`, {
          email,
          password,
        });
        if (response.status === 201) {
          dispatch(setUserInfo(response.data.user));
          localStorage.setItem("authtoken",response.data.token)
          navigate("/profile");
        }
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[90vh] bg-white   border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10  items-center justify-center">
          <div className="flex justify-center items-center flex-col">
            <div className="flex items-center justify-center ">
              <h1 className="text-5xl font-bold  md:text-6xl">Welcome</h1>
              <img src={Victory} alt="" className="h-[100px] " />
            </div>
            <p className="font-medium text-center">
              Fill in the Details to get started with this chat app
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4 " defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full ">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>

                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="signup"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>

              {/* <---------------------------------Login Starts here-----------------------------------> */}

              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Enter Your Email"
                  type="email"
                  className="rounded-full p-6"
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                />

                <Input
                  placeholder="Enter Your Password"
                  type="password"
                  className="rounded-full p-6"
                  onChange={(e) => {
                    setpassword(e.target.value);
                  }}
                />

                <Button
                  className="rounded-full p-6"
                  onClick={() => {
                    handleLogin();
                  }}
                >
                  Login
                </Button>
              </TabsContent>

              {/* <---------------------------------signup Starts here-----------------------------------> */}

              <TabsContent className="flex flex-col gap-5" value="signup">
                {/* <Input placeholder="Enter Your Name"  type="text" className="rounded-full p-6" onChange={(e)=>{
                  setname(e.target.value)
                  }}/> */}

                <Input
                  placeholder="Enter Your Email"
                  type="email"
                  className="rounded-full p-6"
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                />

                <Input
                  placeholder="Enter Your Password"
                  type="password"
                  className="rounded-full p-6"
                  onChange={(e) => {
                    setpassword(e.target.value);
                  }}
                />

                <Input
                  placeholder="Confirm Your Password"
                  type="password"
                  className="rounded-full p-6"
                  onChange={(e) => {
                    setconfirmPassword(e.target.value);
                  }}
                />

                <Button
                  className="rounded-full p-6"
                  onClick={() => {
                    handleSignup();
                  }}
                >
                  SignUp
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex x justify-center items-center">
          <img src={Background} alt="" className="h-[500px]" />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
