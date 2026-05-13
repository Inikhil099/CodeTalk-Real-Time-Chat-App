import {
  addChannelInChangeList,
  addContactsInDMContacts,
  addMessage,
} from "@/redux/slices/chatSlice";
import { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
const backend_url = "https://commented-sets-future-opposed.trycloudflare.com";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const socket = useRef();
  const userInfo = useSelector((state) => state.Auth.uservalue);
  const { selectedChatType, selectedChatData } = useSelector(
    (state) => state.chat,
  );

  useEffect(() => {
    if (userInfo) {
      socket.current = io(`${backend_url}`, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {});

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  useEffect(() => {
    if (!socket.current) return;

    const handleReceiveMessage = (message) => {
      if (
        (selectedChatType !== undefined &&
          selectedChatData?._id === message.sender?._id) ||
        selectedChatData?._id === message.receiver?._id
      ) {
        dispatch(addMessage(message));
      }
      dispatch(addContactsInDMContacts({ message, userInfo }));
    };

    const handleReceiveChannelMessage = async (message) => {
      if (
        selectedChatType !== undefined &&
        selectedChatData?._id === message.channelId
      ) {
        dispatch(addMessage(message));
        dispatch(addChannelInChangeList(message));
      }
    };

    socket.current.on("receiveMessage", handleReceiveMessage);
    socket.current.on("receive-channel-message", handleReceiveChannelMessage);

    return () => {
      socket.current.off("receiveMessage", handleReceiveMessage); // clean up properly
    };
  }, [selectedChatData, selectedChatType, dispatch]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
