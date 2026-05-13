import React, { useEffect } from "react";
import ProfileInfo from "./components/profile-info/ProfileInfo";
import NewDm from "./components/new-dms/NewDm";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setChannels,
  setdirectMessagesContacts,
} from "@/redux/slices/chatSlice";
import ContactList from "@/components/ui/ContactList";
import CreateChannel from "./components/create-channel/CreateChannel";
import { backend_url } from "@/assets/constants";

function ContactsContainer() {
  const dispatch = useDispatch();
  const { channels } = useSelector((state) => state.chat);
  const { directMessagesContacts } = useSelector((state) => state.chat);
  const getContacts = async () => {
    const res = await backend_url.get(`/contacts/get-contacts-for-dm`);
    dispatch(setdirectMessagesContacts(res.data.contacts));
  };

  const getchannels = async () => {
    const res = await backend_url.get(`/api/channel/get-user-channels`);
    dispatch(setChannels(res.data.channels));
  };

  useEffect(() => {
    getContacts();
    getchannels();
  }, []);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] ">
      <div className="pt-3">
        <Logo />
      </div>

      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"DIRECT MESSAGES"} />
          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>

      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"CHANNELS"} />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
}

export const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold ">Code Talk</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};

export default ContactsContainer;
