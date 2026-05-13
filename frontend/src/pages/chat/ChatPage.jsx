import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-contaniner/ContactsContainer";
import EmptyChatContainer from "./components/empty-chat-container/EmptyChatContainer";
import ChatContainer from "./components/chat-container/ChatContainer";

const ChatPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.Auth.uservalue);
  const {
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useSelector((state) => state.chat);
  const { selectedChatType } = useSelector((state) => state.chat);
  useEffect(() => {
    if (!user.profileSetup) {
      toast("Please Setup Your Profile First To Continue");
      navigate("/profile");
    }
  }, [user]);

  return (
    <>
      <div className="flex h-[100vh] overflow-hidden text-white ">
        {
          isUploading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/50 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
            <h5 className="text-5xl animate-pulse">Uploading File</h5>
            {fileUploadProgress} %
          </div>
        }
        {
          isDownloading && <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/50 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
            <h5 className="text-5xl animate-pulse">Downloading File</h5>
            {fileDownloadProgress} %
          </div>
        }
        <ContactsContainer />
        {!selectedChatType ? <EmptyChatContainer /> : <ChatContainer />}
      </div>
    </>
  );
};

export default ChatPage;
