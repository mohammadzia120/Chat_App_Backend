const Chat = require("../models/model.chat");
const User = require("../models/model.user");

const accessChat = async (req) => {
  const { userId } = req.body;
  if (!userId) {
    return { message: "UserId param not sent with the request", status: 400 };
  }
  let isChat = await Chat.find({
    isGrouptChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    return isChat[0];
  } else {
    let chatData = {
      chatName: "sender",
      isGrouptChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      return { status: 200, fullChat };
    } catch (error) {
      return { result: error.message, status: 400 };
    }
  }
};

const fetchChats = async (req) => {
  try {
    const result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    const results = await User.populate(result, {
      path: "latestMessage.sender",
      select: "name email pic",
    });
    return { results, status: 200 };
  } catch (error) {
    return { result: error.message, status: 400 };
  }
};

const createGroupChat = async (req) => {
  const { name } = req.body;
  if (!name || !req.body.users) {
    return { status: 400, message: "please Enter all the fields" };
  }
  const users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return {
      status: 400,
      message: "More than 2 users are required to form a group",
    };
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return { status: 200, result: fullGroupChat };
  } catch (error) {
    return { result: error.message, status: 400 };
  }
};

const renameGroup = async (req) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return { result: "Chat not found", status: 400 };
  } else {
    return { result: updatedChat, status: 200 };
  }
};

const addToGroup = async (req) => {
  const { chatId, userId } = req.body;
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return { result: "Chat not found", status: 400 };
  }

  if (chat.users.includes(userId)) {
    return { result: "User is already a member of the group", status: 400 };
  }
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $addToSet: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    return { result: "Chat not found", status: 400 };
  } else {
    return { result: added, status: 200 };
  }
};

const removeFromGroup = async (req) => {
  const { chatId, userId } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat.users.includes(userId)) {
    return { result: "User is not present", status: 400 };
  }
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    return { result: "Chat not found", status: 400 };
  } else {
    return { result: removed, status: 200 };
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
