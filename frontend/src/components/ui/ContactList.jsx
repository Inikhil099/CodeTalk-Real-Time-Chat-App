import {
  setSelectedChatType,
  setSelectedChatMessages,
  setSelectedData,
} from "@/redux/slices/chatSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage } from "./avatar";
import { getColor } from "@/lib/utils";

function ContactList({ contacts, isChannel = false }) {
  const dispatch = useDispatch();
  const { selectedChatType, selectedChatData } = useSelector(
    (state) => state.chat
  );

  const handleClick = (contact) => {
    dispatch(setSelectedData(contact))
    if (isChannel) {
      dispatch(setSelectedChatType("channel"));
    } else {
      dispatch(setSelectedChatType("contact"));
    }
    if (selectedChatData && selectedChatData._id !== contacts._id) {
      dispatch(setSelectedChatMessages([]));
    }
  };
  return (
    <div className="mt-5 ">
      {contacts.map((e) => {
        return (
          <div
            key={e._id}
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
              selectedChatData && selectedChatData._id == e._id
                ? "bg-[#8417ff] hover:bg-[#8417ff] "
                : "hover:bg-[#f1f1f111]"
            }`}
            onClick={() => {
              handleClick(e);
            }}
          >
            <div className="flex gap-5 items-center justify-start text-neutral-300">
              {!isChannel && (
                <Avatar className="h-10 w-10 rounded-full border-[1px] overflow-hidden">
                  {e.Image ? (
                    <AvatarImage
                      src={`http://localhost:3000/${e.Image}`}
                      alt="profile imgage"
                      className="object-cover bg-black w-full h-full"
                    />
                  ) : (
                    <div
                      className={`
                        ${selectedChatData && selectedChatData._id == e._id ? "bg-[ffffff22] border border-white/70" : `${getColor(e.color)}`}
                        uppercase h-10 w-10 text-lg flex items-center justify-center rounded-full ${getColor(
                        e.color
                      )}`}
                    >
                      {e.firstName
                        ? e.firstName.split("").shift()
                        : e.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
              )}
              {
                isChannel && <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>
              }
              {
              isChannel ? <span className="">{e.name}</span> : <span className="">{
                e.firstName ? `${e.firstName} ${e.lastName}` : e.email}
                </span>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ContactList;
