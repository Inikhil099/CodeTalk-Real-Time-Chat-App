import { backend_url } from "@/assets/constants";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/context/socketContext";
import {
  setfileUploadProgress,
  setisUploading,
} from "@/redux/slices/chatSlice";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useContext, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

function MessageBar() {
  const dispatch = useDispatch();
  const { selectedChatType, selectedChatData } = useSelector(
    (state) => state.chat
  );
  const userinfo = useSelector((state) => state.Auth.uservalue);
  const {
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useSelector((state) => state.chat);
  const fileInputRef = useRef();
  const socket = useSocket();
  const [message, setmessage] = useState("");
  const emojiRef = useRef(null);
  const [emojiPickerOpen, setemojiPickerOpen] = useState(false);
  const handleTypeEmoji = (emoji) => {
    setmessage(message + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userinfo.id,
        content: message,
        receiver: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
    else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userinfo.id,
        content: message,
        channelId: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        dispatch(setisUploading(true));
        const res = await backend_url.post(
          `/api/messages/upload-file`,
          formData,
          {
            onUploadProgress: (data) =>
              dispatch(
                setfileUploadProgress(
                  Math.round(100 * data.loaded) / data.total
                )
              ),
          }
        );
        if (res.status == 200 && res.data) {
          setTimeout(() => {
            dispatch(setisUploading(false));
          }, 2000);
          if (selectedChatType == "contact") {
            socket.emit("sendMessage", {
              sender: userinfo.id,
              content: undefined,
              receiver: selectedChatData._id,
              messageType: "file",
              fileUrl: res.data.filepath,
            });
          }
          else if (selectedChatType == "channel") {
            socket.emit("send-channel-message", {
              sender: userinfo.id,
              content: undefined,
              channelId: selectedChatData._id,
              messageType: "file",
              fileUrl: res.data.filepath,
            });
          }
        }
      }
    } catch (error) {
      dispatch(setisUploading(false));
      console.log(error);
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-6">
        <Input
          className="flex-1 bg-transparent p-5 rounded-md focus:border-none focus:outline-none"
          type="text"
          value={message}
          onChange={(e) => {
            setmessage(e.target.value);
          }}
          placeholder="Enter Your Message"
        />

        <button
          onClick={() => {
            handleAttachmentClick();
          }}
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={(e) => {
              setemojiPickerOpen(!emojiPickerOpen);
            }}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>

          <div className="absolute bottom-16 right-0">
            {/* {emojiPickerOpen ? <EmojiPicker theme='dark' open={emojiPickerOpen} onEmojiClick={()=>{handleEmoji()}} autoFocusSearch={false} /> : ""} */}
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              autoFocusSearch={false}
              onEmojiClick={(emoji) => {
                handleTypeEmoji(emoji);
              }}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-[#8147ff] rounded-md flex items-center justify-center p-5 focus:border-none focus:outline-none focus:bg-[#741bda] focus:text-white duration-300 transition-all hover:bg-[#741bda]"
        onClick={() => {
          handleSendMessage();
          setmessage("");
        }}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
}

export default MessageBar;
