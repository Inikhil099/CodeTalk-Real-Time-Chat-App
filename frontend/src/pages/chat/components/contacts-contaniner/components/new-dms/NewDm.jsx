import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import Lottie from "react-lottie";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedChatMessages,
  setSelectedChatType,
  setSelectedData,
} from "@/redux/slices/chatSlice";
import { backend_url } from "@/assets/constants";

function NewDm() {
  const dispatch = useDispatch();
  const [openNewContactModel, setopenNewContactModel] = useState(false);
  const [searchedContacts, setsearchedContacts] = useState([]);
  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const res = await backend_url.post(
          `/contacts/search`,
          { searchTerm },
        );
        if (res.status == 200 && res.data.contacts) {
          setsearchedContacts(res.data.contacts);
        } else {
          setsearchedContacts([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = async (contact) => {
    setopenNewContactModel(false);
    dispatch(setSelectedChatType("contact"));
    dispatch(setSelectedData(contact));
    dispatch(setSelectedChatMessages([]));
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => {
                setopenNewContactModel(true);
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white ">
            <p>Select New Contact </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4"></ScrollArea> */}
      <Dialog open={openNewContactModel} onOpenChange={setopenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col ">
          <DialogHeader>
            <DialogTitle className="text-center">Select A Contact</DialogTitle>
          </DialogHeader>
          <div className="">
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => {
                searchContacts(e.target.value);
              }}
            />
          </div>
          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px] ">
              <div className="flex flex-col gap-5 ">
                {searchedContacts.map((e) => {
                  return (
                    <div
                      className="flex gap-3 items-center cursor-pointer "
                      key={e._id}
                      onClick={() => {
                        selectNewContact(e);
                      }}
                    >
                      <div className="w-12 h-12 relative">
                        <Avatar className="h-12 w-12 rounded-full border-[1px] overflow-hidden">
                          {e.Image ? (
                            <AvatarImage
                              src={`${backend_url}/${e.Image}`}
                              alt="profile imgage"
                              className="object-cover bg-black w-full h-full rounded-full"
                            />
                          ) : (
                            <div
                              className={`uppercase h-12 w-12 text-lg flex items-center justify-center rounded-full ${getColor(
                                e.color,
                              )}`}
                            >
                              {e.firstName
                                ? e.firstName.split("").shift()
                                : e.email.split("").shift()}
                            </div>
                          )}
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <span>
                          {e.firstName && e.lastName
                            ? `${e.firstName} ${e.lastName}`
                            : e.email}
                        </span>
                        <span className="text-xs">{e.email}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {searchedContacts.length <= 0 && (
            <div className="flex-1 mt-5 md:flex md:mt-0 flex-col items-center justify-center duration-1000 transition-all ">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi <span className="text-purple-500">!</span> Search New
                  <span className="text-purple-500"> Contact.. </span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewDm;
