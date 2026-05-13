import {
  setfileDownloadProgress,
  setisDownloading,
  setisUploading,
  setSelectedChatMessages,
} from "@/redux/slices/chatSlice";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { backend_url } from "@/assets/constants";

function MessageContainer() {
  const scrollRef = useRef();
  const [showImage, setshowImage] = useState(false);
  const [imageUrl, setimageUrl] = useState(null);
  const dispatch = useDispatch();
  const { selectedChatType, selectedChatData, selectedChatMessages } =
    useSelector((state) => state.chat);
  const userinfo = useSelector((state) => state.Auth.uservalue);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((e, ind) => {
      const messageDate = moment(e.timestamp).format("DD-MM-YYYY");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div className="" key={ind}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(e.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDmMessages(e)}
          {selectedChatType === "channel" && renderChannelMessage(e)}
        </div>
      );
    });
  };

  const downloadFile = async (url) => {
    dispatch(setisDownloading(true));
    dispatch(setfileDownloadProgress(0));
    const res = await backend_url.get(`/${url}`, {
      responseType: "blob",
      onDownloadProgress: (data) =>
        dispatch(
          setfileDownloadProgress(Math.round(data.loaded * 100) / data.total),
        ),
    });
    setTimeout(() => {
      dispatch(setisDownloading(false));
      dispatch(setfileDownloadProgress(0));
    }, 2000);
    const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
  };

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const renderDmMessages = (message) => {
    return (
      <div
        className={`
          ${
            message.sender === selectedChatData._id ? "text-left" : "text-right"
          }
          }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white border-[#ffffff]/20"
            } " border inline-block py-2 px-4 rounded my-1 max-w-[50%] break-words ml-9`}
          >
            {message.content}
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white border-[#ffffff]/20"
            } " border inline-block py-2 px-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div className="cursor-pointer">
                <img
                  onClick={(e) => {
                    setshowImage(true);
                    setimageUrl(message.fileUrl);
                  }}
                  src={`${backend_url}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center gap-4">
                <span className="text-white/8 text-xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span className="">{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={(e) => {
                    downloadFile(message.fileUrl);
                  }}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-600 ">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessage = (message) => {
    return (
      <div
        className={`mt-5  ${
          message.sender._id !== userinfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id !== userinfo._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white border-[#ffffff]/20"
            } " border inline-block py-2 px-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id !== userinfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white border-[#ffffff]/20"
            } " border inline-block py-2 px-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div className="cursor-pointer">
                <img
                  onClick={(e) => {
                    setshowImage(true);
                    setimageUrl(message.fileUrl);
                  }}
                  src={`${backend_url}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center gap-4">
                <span className="text-white/8 text-xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span className="">{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={(e) => {
                    downloadFile(message.fileUrl);
                  }}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}

        {message.sender._id !== userinfo.id ? (
          <div className="flex items-center justify-start gap-3 ">
            <Avatar className="h-8 w-8 rounded-full border-[1px] overflow-hidden">
              {message.sender.Image && (
                <AvatarImage
                  src={`${backend_url}/${message.sender.Image}`}
                  alt="profile imgage"
                  className="object-cover bg-black w-full h-full"
                />
              )}
              (
              <AvatarFallback
                className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(
                  message.color,
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email.split("").shift()}
              </AvatarFallback>
              )
            </Avatar>
            <span className="text-sm text-white/60">
              {message.sender.firstName} {message.sender.lastName}
            </span>
            <span className="text-sm text-white/60">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-sm text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!scrollRef) {
      scrollRef.current.scrollIntoView({ behavious: "smooth" });
    }
  }, [selectedChatMessages]);

  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const res = await backend_url.post(
          `/api/messages/get-messages`,
          { id: selectedChatData._id },
        );
        if (res.data.messages) {
          dispatch(setSelectedChatMessages(res.data.messages));
        }
      } catch (error) {}
    };

    const getChannelMessages = async () => {
      try {
        const res = await backend_url.get(
          `/api/channel/get-channel-messages/${selectedChatData._id}`,
        );
        if (res.data.allChannelMessages) {
          dispatch(setSelectedChatMessages(res.data.allChannelMessages));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getAllMessages();
      } else if (selectedChatType === "channel") {
        getChannelMessages();
      }
    }
  }, [selectedChatData, selectedChatType]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div className="" ref={scrollRef}>
        {showImage && (
          <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
            <div className="">
              <img
                src={`${backend_url}/${imageUrl}`}
                className="h-[80vh] w-full bg-cover"
                alt=""
              />
            </div>
            <div className="flex gap-5 fixed top-0 mt-5">
              <button
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={(e) => {
                  downloadFile(imageUrl);
                }}
              >
                <IoMdArrowRoundDown />
              </button>

              <button
                className="bg-black/20  p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={(e) => {
                  setshowImage(false);
                  setimageUrl(null);
                }}
              >
                <IoCloseSharp />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageContainer;
