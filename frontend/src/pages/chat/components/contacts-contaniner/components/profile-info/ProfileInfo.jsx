import { backend_url } from "@/assets/constants";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { setUserInfo } from "@/redux/slices/authSlice";
import axios from "axios";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function ProfileInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.Auth.uservalue);
  const userLogout = async () => {
    try {
      const res = await backend_url.post(`/user/logout`, {});
      if (res.status == 200) {
        dispatch(setUserInfo(null));
        localStorage.removeItem("authtoken");
        navigate("/auth");
        toast.success("Logged Out Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="absolute bottom-0 h-16 flex justify-between items-center px-10 w-full bg-[#2a2b33]  ">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full border-[1px] overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${backend_url}/${userInfo.image}`}
                alt="profile imgage"
                className="object-cover bg-black w-full h-full"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg flex items-center justify-center rounded-full ${getColor(
                  userInfo.color,
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div className="">
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                onClick={() => {
                  navigate("/profile");
                }}
                className="text-purple-500 text-xl font-medium"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Rename</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                onClick={() => {
                  userLogout();
                }}
                className="text-red-500 text-xl font-medium"
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Log Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ProfileInfo;
