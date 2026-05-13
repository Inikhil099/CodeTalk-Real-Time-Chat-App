import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const initialState = {
  directMessagesContacts: [],
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChatType: (state, action) => {
      state.selectedChatType = action.payload;
    },
    setdirectMessagesContacts: (state, action) => {
      state.directMessagesContacts = action.payload;
    },
    setSelectedData: (state, action) => {
      state.selectedChatData = action.payload;
    },
    setSelectedChatMessages: (state, action) => {
      state.selectedChatMessages = action.payload;
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const { selectedChatType } = state;

      state.selectedChatMessages.push({
        ...message,
        receiver:
          selectedChatType === "channel"
            ? message.receiver
            : message.receiver._id,
        sender:
          selectedChatType === "channel" ? message.sender : message.sender._id,
      });
    },
    closeChat: (state, action) => {
      (state.selectedChatData = undefined),
        (state.selectedChatType = undefined),
        (state.selectedChatMessages = []);
    },
    setisUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setisDownloading: (state, action) => {
      state.isDownloading = action.payload;
    },
    setfileUploadProgress: (state, action) => {
      state.fileUploadProgress = action.payload;
    },
    setfileDownloadProgress: (state, action) => {
      state.fileDownloadProgress = action.payload;
    },
    setChannels: (state, action) => {
      state.channels = action.payload;
    },
    addChannel: (state, action) => {
      const channel = action.payload;
      state.channels = [channel, ...state.channels];
    },
    addChannelInChangeList: (state, action) => {
      let message = action.payload;
      const data = state.channels.find(
        (channel) => channel._id === message.channelId
      );
      const index = state.channels.findIndex(
        (channel) => channel._id === message.channelId
      );
      if (index !== -1 && index !== undefined) {
        state.channels.splice(index, 1);
        state.channels.unshift(data);
      }
    },
    addContactsInDMContacts: (state,action) => {
      const {message} = action.payload
      const {userInfo} = action.payload
      const userId = userInfo.id
      const fromId =
        message.sender._id === userId
          ? message.receiver._id
          : message.sender._id;
      const fromData =
        message.sender._id === userId ? message.receiver : message.sender;
      const dmContacts = state.directMessagesContacts;
      const data = dmContacts.find((contact) => contact._id === fromId);
      const index = dmContacts.findIndex((contact) => contact._id === fromId);
      if (index !== -1 && index !== undefined) {
        dmContacts.splice(index, 1);
        dmContacts.unshift(data);
      } else {
        dmContacts.unshift(fromData);
      }
      state.directMessagesContacts =  dmContacts;
    },
  },
});

export const {
  setSelectedChatType,
  setSelectedData,
  setSelectedChatMessages,
  closeChat,
  addMessage,
  setdirectMessagesContacts,
  setisUploading,
  setisDownloading,
  setfileUploadProgress,
  setfileDownloadProgress,
  setChannels,
  addChannel,
  addChannelInChangeList,
  addContactsInDMContacts,
} = chatSlice.actions;

export default chatSlice.reducer;
