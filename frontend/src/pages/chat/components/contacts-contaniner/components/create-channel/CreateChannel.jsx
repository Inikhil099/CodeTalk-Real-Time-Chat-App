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

import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/MultipleSelector";
import { addChannel, setChannels } from "@/redux/slices/chatSlice";
import { backend_url } from "@/assets/constants";

function CreateChannel() {
  const dispatch = useDispatch();
  const [openNewChannelModel, setopenNewChannelModel] = useState(false);
  const [allContacts, setallContacts] = useState([]);
  const [selectedContacts, setselectedContacts] = useState([]);
  const [channelName, setchannelName] = useState("");

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const res = await backend_url.post(
          `/api/channel/create-channel`,
          {
            name: channelName,
            members: selectedContacts.map((e) => e.value),
          },
        );
        if (res.status == 201) {
          setchannelName("");
          setselectedContacts([]);
          setopenNewChannelModel(false);
          dispatch(addChannel(res.data.channel));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const res = await backend_url.get(`/contacts/get-all-contacts`);
      setallContacts(res.data.contacts);
    };
    getData();
  }, []);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => {
                setopenNewChannelModel(true);
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white ">
            <p>Create New Channel </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4"></ScrollArea> */}
      <Dialog open={openNewChannelModel} onOpenChange={setopenNewChannelModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col ">
          <DialogHeader>
            <DialogTitle className="text-center">
              Fill Up The Details For New Channel
            </DialogTitle>
          </DialogHeader>
          <div className="">
            <Input
              placeholder="Search Channel"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => {
                setchannelName(e.target.value);
              }}
              value={channelName}
            />
          </div>
          <div className="">
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Search Contacts"
              value={selectedContacts}
              onChange={(e) => {
                setselectedContacts(e);
              }}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">
                  No Results Found
                </p>
              }
            />
          </div>
          <div>
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={() => {
                createChannel();
              }}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateChannel;
