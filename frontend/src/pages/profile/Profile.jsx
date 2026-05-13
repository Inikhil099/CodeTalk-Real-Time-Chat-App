import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { setUserInfo } from "@/redux/slices/authSlice";
import { useEffect } from "react";
import { backend_url } from "@/assets/constants";

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.Auth.uservalue);
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [image, setimage] = useState(null);
  const [hovered, sethovered] = useState(false);
  const [selectedcolor, setselectedcolor] = useState(0);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.profileSetup) {
      setfirstName(user.firstName);
      setlastName(user.lastName);
      setselectedcolor(user.color);
    }
    if (user.Image) {
      setimage(`${backend_url}/${user.Image}`);
    }
  }, [user]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }
    return true;
  };
  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const res = await backend_url.post(`/user/update-profile`, {
          firstName,
          lastName,
          color: selectedcolor,
        });
        if (res.status === 200 && res.data.userdata) {
          dispatch(
            setUserInfo({
              ...user,
              firstName: res.data.userdata.firstName,
              lastName: res.data.userdata.lastName,
              color: selectedcolor,
              profileSetup: res.data.userdata.profileSetup,
            }),
          );
          toast.success("Profile Updated");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleNavigate = () => {
    if (user.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please Setup Profile");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formdata = new FormData();
      formdata.append("profile-image", file);
      const res = await backend_url.post(`/user/add-profile-image`, formdata);
      if (res.status == 200 && res.data.img) {
        dispatch(setUserInfo({ ...user, Image: res.data.Image }));
        toast.success("Image Updated Successfully");
      }

      const reader = new FileReader();
      reader.onload = () => {
        setimage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async (e) => {
    try {
      const res = await backend_url.delete(`/user/remove-profile-image`);
      if (res.status == 200) {
        setUserInfo({ ...user, image: null });
        toast.success("Image Removed Successfully");
        setimage(null);
      }
    } catch (error) {}
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center gap-10 flex-col">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div
          onClick={() => {
            handleNavigate();
          }}
          className=""
        >
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => {
              sethovered(true);
            }}
            onMouseLeave={() => {
              sethovered(false);
            }}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full border-[1px] overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile imgage"
                  className="object-cover bg-black w-full h-full"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl  flex items-center justify-center rounded-full ${getColor(selectedcolor)}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : user.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer ring-fuchsia-50"
                onClick={(e) => {
                  image ? handleDeleteImage() : handleFileInputClick();
                }}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              name="profile-image"
              accept=".png ,.jpg , .jpeg , .svg , .webp"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                handleImageChange(e);
              }}
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Enter your email here"
                type="email"
                disabled
                value={user.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                onChange={(e) => {
                  setfirstName(e.target.value);
                }}
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                onChange={(e) => {
                  setlastName(e.target.value);
                }}
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((e, index) => {
                return (
                  <div
                    className={`${e} h-8 w-8 rounded-full cursor-pointer transition-all duration-300  ${selectedcolor === index ? "outline outline-white/50 outline-1" : ""}`}
                    key={index}
                    onClick={(e) => {
                      setselectedcolor(index);
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Button
          className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
          onClick={() => {
            saveChanges();
          }}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
