/**
 * @file 聊天页面 - 微信风格布局
 * @description 左侧联系人列表，右侧聊天区域的微信风格布局
 */

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import {
  getChatContactsApi,
  getChatHistoryApi,
  sendTextMessageApi,
  sendFileMessageApi,
} from "@/lib/api/chatApi";
import { getUserInfoApi } from "@/lib/api/userApi";
import LanguageText from "@/components/common/LanguageText/LanguageText";
import { formatPostTime } from "@/lib/utils/dateUtils";
import { MessageType } from "@/types/chatTypes";

/**
 * 联系人接口
 */
interface Contact {
  userId: string;
  username: string;
  nickname?: string;
  avatarUrl?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

/**
 * 消息接口
 */
interface Message {
  messageId: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  msgType: string;
  status: string;
  revoked: number;
  ctime: string;
  mtime: string;
  isSystemMessage?: boolean; // 新增系统消息标识
}

/**
 * 微信风格聊天页面组件
 */
export default function ChatPage() {
  const { user } = useUserStore();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get("userId");

  // 消息列表滚动容器引用
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 联系人列表状态
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);

  // 当前选中的联系人
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // 聊天消息状态
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // 发送消息状态
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendingFile, setSendingFile] = useState(false);

  /**
   * 添加系统消息到聊天列表
   */
  const addSystemMessage = useCallback(
    (content: string, contactUserId: string) => {
      const systemMessage: Message = {
        messageId: `system_${Date.now()}`,
        fromUserId: "system",
        toUserId: contactUserId,
        content: content,
        msgType: "text",
        status: "sent",
        revoked: 0,
        ctime: new Date().toISOString(),
        mtime: new Date().toISOString(),
        isSystemMessage: true,
      };

      setMessages((prev) => [...prev, systemMessage]);

      // 滚动到底部
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    },
    []
  );

  /**
   * 滚动到消息列表底部
   */
  const scrollToBottom = useCallback((smooth: boolean = true) => {
    // 使用更安全的滚动方式，确保只在消息容器内滚动
    if (messagesEndRef.current) {
      try {
        const messagesContainer = messagesEndRef.current.closest(
          ".chat-messages-container"
        );
        if (messagesContainer) {
          // 使用平滑的容器内滚动，不影响页面布局
          messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: smooth ? "smooth" : "auto",
          });
        } else {
          // 备用方案：直接滚动到元素位置，但限制在容器内
          messagesEndRef.current.scrollIntoView({
            behavior: smooth ? "smooth" : "auto",
            block: "end",
            inline: "nearest",
          });
        }
      } catch (error) {
        // 出错时静默处理，避免影响用户体验
        console.warn("滚动到底部失败:", error);
      }
    }
  }, []);

  /**
   * 获取联系人列表
   */
  const fetchContacts = async () => {
    if (!user) return;

    try {
      setContactsLoading(true);
      const response = await getChatContactsApi();
      const contactsList = [...(response || [])];

      // 如果URL中有指定用户ID，确保该联系人在列表顶部
      if (targetUserId) {
        const targetContactIndex = contactsList.findIndex(
          (c: Contact) => c.userId === targetUserId
        );

        if (targetContactIndex > -1) {
          // 如果找到该联系人，将其移到顶部
          const targetContact = contactsList.splice(targetContactIndex, 1)[0];
          contactsList.unshift(targetContact);
          // 设置选中状态但不立即获取聊天记录，避免页面跳动
          setSelectedContact(targetContact);
          // 延迟获取聊天记录，确保DOM稳定
          setTimeout(() => {
            fetchChatHistory(targetContact.userId);
          }, 300);
        } else {
          // 如果联系人列表中没有该用户，获取用户信息并创建联系人，置于顶部
          try {
            const userInfo = await getUserInfoApi({ userId: targetUserId });
            const avatarValue =
              (userInfo as any).avatarUrl || (userInfo as any).avatar || "";
            const newContact: Contact = {
              userId: userInfo.userId,
              username: userInfo.username,
              nickname: userInfo.username,
              avatarUrl: avatarValue,
              lastMessage: "",
              lastMessageTime: new Date().toISOString(),
              unreadCount: 0,
            };
            contactsList.unshift(newContact); // 添加到顶部
            setSelectedContact(newContact);
            // 延迟获取聊天记录
            setTimeout(() => {
              fetchChatHistory(newContact.userId);
            }, 300);
          } catch (error) {
            console.error("获取目标用户信息失败:", error);
          }
        }
      }

      setContacts(contactsList);

      // 如果没有指定targetUserId且有联系人，默认选择第一个联系人
      if (!targetUserId && contactsList.length > 0 && !selectedContact) {
        const firstContact = contactsList[0];
        setSelectedContact(firstContact);
        // 延迟获取聊天记录，确保DOM稳定
        setTimeout(() => {
          fetchChatHistory(firstContact.userId);
        }, 300);
      }
    } catch (error) {
      console.error("获取联系人列表失败:", error);
    } finally {
      setContactsLoading(false);
    }
  };

  /**
   * 获取聊天历史记录
   */
  const fetchChatHistory = async (withUserId: string) => {
    if (!user) return;

    try {
      setMessagesLoading(true);
      console.log("开始获取聊天记录:", {
        withUserId,
        currentUserId: user.userId,
      });

      const response = await getChatHistoryApi({
        with_user_id: withUserId,
        page: 1,
        size: 50,
      });

      console.log("聊天记录API响应:", response);

      // 倒序显示消息（最新的在底部）
      const sortedMessages = (response.list || []).reverse();
      console.log("排序后的消息列表:", sortedMessages);

      setMessages(sortedMessages);

      // 延迟滚动，确保DOM更新完成
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom(true); // 切换联系人时使用平滑滚动
        });
      });
    } catch (error) {
      console.error("获取聊天记录失败:", error);
      // 如果获取失败，至少清空消息列表
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  /**
   * 发送文本消息
   */
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedContact || sendingMessage) return;

    const messageContent = messageInput.trim();
    const currentContact = selectedContact;
    const tempMessageId = `temp_${Date.now()}`;

    try {
      setSendingMessage(true);

      // 立即添加消息到本地状态（乐观更新）
      const tempMessage: Message = {
        messageId: tempMessageId,
        fromUserId: user!.userId,
        toUserId: currentContact.userId,
        content: messageContent,
        msgType: "text",
        status: "sending",
        revoked: 0,
        ctime: new Date().toISOString(),
        mtime: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tempMessage]);
      setMessageInput(""); // 立即清空输入框

      // 发送消息后立即滚动到底部（不使用动画）
      requestAnimationFrame(() => {
        scrollToBottom(false);
      });

      // 发送到服务器
      console.log("🚀 发送消息到服务器:", {
        to_user_id: currentContact.userId,
        content: messageContent,
        msg_type: "text",
      });

      const result = await sendTextMessageApi({
        to_user_id: currentContact.userId,
        content: messageContent,
        msg_type: "text",
      });

      console.log("✅ 消息发送成功，服务器返回:", result);

      // 更新临时消息状态
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === tempMessageId
            ? { ...msg, messageId: result.messageId, status: "sent" }
            : msg
        )
      );

      // 更新联系人列表中的最后消息
      setContacts((prev) =>
        prev.map((contact) =>
          contact.userId === currentContact.userId
            ? {
                ...contact,
                lastMessage: messageContent,
                lastMessageTime: new Date().toISOString(),
              }
            : contact
        )
      );
    } catch (error: any) {
      console.error("发送消息失败:", error);

      // 发送失败，移除临时消息
      setMessages((prev) =>
        prev.filter((msg) => msg.messageId !== tempMessageId)
      );

      // 恢复输入框内容
      setMessageInput(messageContent);

      // 根据错误类型显示相应的系统提示
      let systemMessage = "";
      if (error.message && error.message.includes("每日消息发送次数已达上限")) {
        systemMessage =
          "今日消息发送次数已达上限，请明天再试或关注对方后无限制聊天";
      } else if (error.message && error.message.includes("权限")) {
        systemMessage = "您暂时无法向该用户发送消息，请关注对方后再试";
      } else {
        systemMessage = `消息发送失败：${
          error.message || "网络错误，请稍后重试"
        }`;
      }

      // 添加系统提示消息
      addSystemMessage(systemMessage, currentContact.userId);
    } finally {
      setSendingMessage(false);

      // 聚焦回输入框
      setTimeout(() => {
        messageInputRef.current?.focus();
      }, 100);
    }
  };

  /**
   * 发送文件消息
   *
   * 直接发送文件到后端，由后端service层处理文件上传和URL存储
   */
  const handleSendFile = async (file: File, msgType: MessageType) => {
    if (!selectedContact || sendingFile) return;

    const currentContact = selectedContact;
    const tempMessageId = `temp_file_${Date.now()}`;

    try {
      setSendingFile(true);

      // 立即添加文件消息到本地状态（乐观更新）
      const tempMessage: Message = {
        messageId: tempMessageId,
        fromUserId: user!.userId,
        toUserId: currentContact.userId,
        content: `[${
          msgType === "image"
            ? "图片"
            : msgType === "video"
            ? "视频"
            : msgType === "voice"
            ? "语音"
            : "文件"
        }] ${file.name}\n正在上传...`,
        msgType: msgType,
        status: "sending",
        revoked: 0,
        ctime: new Date().toISOString(),
        mtime: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tempMessage]);

      // 发送文件时立即滚动到底部（不使用动画）
      requestAnimationFrame(() => {
        scrollToBottom(false);
      });

      // 直接发送文件到后端，由后端处理上传和URL存储
      const result = await sendFileMessageApi({
        to_user_id: currentContact.userId,
        content: "", // 让后端根据文件类型自动生成描述
        msg_type: msgType,
        file: file,
      });

      console.log("🎯 文件上传成功，服务器返回:", result);

      // 先标记临时消息为发送成功
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === tempMessageId
            ? {
                ...msg,
                messageId: result.messageId,
                status: "sent",
              }
            : msg
        )
      );

      // 更新联系人列表中的最后消息
      setContacts((prev) =>
        prev.map((contact) =>
          contact.userId === currentContact.userId
            ? {
                ...contact,
                lastMessage: `[${
                  msgType === "image"
                    ? "图片"
                    : msgType === "video"
                    ? "视频"
                    : msgType === "voice"
                    ? "语音"
                    : "文件"
                }]`,
                lastMessageTime: new Date().toISOString(),
              }
            : contact
        )
      );

      // 短暂延迟后重新获取聊天记录，但使用优化的滚动策略
      setTimeout(async () => {
        try {
          // 保存当前滚动位置，用于判断是否需要滚动
          const messagesContainer = messagesEndRef.current?.closest(
            ".chat-messages-container"
          ) as HTMLElement;
          const wasAtBottom = messagesContainer
            ? Math.abs(
                messagesContainer.scrollTop +
                  messagesContainer.clientHeight -
                  messagesContainer.scrollHeight
              ) <= 20
            : true;

          // 重新获取聊天记录以获取包含文件URL的完整消息
          const response = await getChatHistoryApi({
            with_user_id: currentContact.userId,
            page: 1,
            size: 50,
          });

          const sortedMessages = (response.list || []).reverse();

          // 更新消息列表，但保持当前用户的滚动体验
          setMessages(sortedMessages);

          // 只有在用户之前就在底部时才自动滚动，避免干扰用户浏览历史消息
          if (wasAtBottom) {
            // 延迟滚动，确保DOM更新完成，使用无动画滚动避免视觉干扰
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                scrollToBottom(false);
              });
            });
          }
        } catch (error) {
          console.error("重新获取聊天记录失败:", error);
        }
      }, 600); // 稍微缩短延迟时间
    } catch (error: any) {
      console.error("发送文件失败:", error);

      // 发送失败，移除临时消息
      setMessages((prev) =>
        prev.filter((msg) => msg.messageId !== tempMessageId)
      );

      // 显示错误提示
      let systemMessage = "";
      if (error.message && error.message.includes("每日消息发送次数已达上限")) {
        systemMessage =
          "今日消息发送次数已达上限，请明天再试或关注对方后无限制聊天";
      } else if (error.message && error.message.includes("权限")) {
        systemMessage = "您暂时无法向该用户发送文件，请关注对方后再试";
      } else if (error.message && error.message.includes("文件大小")) {
        systemMessage = "文件大小超出限制，请选择较小的文件";
      } else if (error.message && error.message.includes("文件类型")) {
        systemMessage = "不支持的文件类型";
      } else {
        systemMessage = `文件发送失败：${
          error.message || "网络错误，请稍后重试"
        }`;
      }

      // 添加系统提示消息
      addSystemMessage(systemMessage, currentContact.userId);
    } finally {
      setSendingFile(false);
    }
  };

  /**
   * 处理文件选择
   *
   * 根据文件MIME类型和扩展名确定消息类型，支持更多文件类型
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 获取文件扩展名
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split(".").pop() || "";

    // 根据文件MIME类型和扩展名确定消息类型
    let msgType: MessageType = "file";

    // 图片类型
    if (
      file.type.startsWith("image/") ||
      [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "webp",
        "svg",
        "ico",
        "tiff",
      ].includes(fileExtension)
    ) {
      msgType = "image";
    }
    // 视频类型
    else if (
      file.type.startsWith("video/") ||
      [
        "mp4",
        "avi",
        "mov",
        "wmv",
        "flv",
        "webm",
        "mkv",
        "m4v",
        "3gp",
        "rm",
        "rmvb",
      ].includes(fileExtension)
    ) {
      msgType = "video";
    }
    // 音频类型
    else if (
      file.type.startsWith("audio/") ||
      ["mp3", "wav", "ogg", "m4a", "aac", "flac", "wma", "opus"].includes(
        fileExtension
      )
    ) {
      msgType = "voice";
    }
    // 其他文件类型保持为 'file'

    console.log("📎 选择文件:", {
      name: file.name,
      type: file.type,
      size: file.size,
      extension: fileExtension,
      msgType: msgType,
    });

    // 发送文件（后端会处理文件上传和验证）
    handleSendFile(file, msgType);

    // 清空文件输入
    event.target.value = "";
  };

  /**
   * 选择联系人
   */
  const handleSelectContact = async (
    contact: Contact,
    event?: React.MouseEvent
  ) => {
    // 完全阻止默认行为和事件冒泡
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    setSelectedContact(contact);
    await fetchChatHistory(contact.userId);
  };

  /**
   * 处理Enter键发送消息
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSendMessage();
    }
  };

  /**
   * 处理输入框内容变化
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);

    // 自动调整输入框高度
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  // 初始化数据
  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user, targetUserId]);

  // 如果用户未登录，显示登录提示
  if (!user) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-dark-primary dark:to-zinc-900">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-3">
            <LanguageText
              texts={{
                "zh-CN": "欢迎来到聊天室",
                "zh-TW": "歡迎來到聊天室",
                en: "Welcome to Chat",
              }}
            />
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
            <LanguageText
              texts={{
                "zh-CN": "登录后即可与朋友们畅聊无阻",
                "zh-TW": "登錄後即可與朋友們暢聊無阻",
                en: "Login to start chatting with friends",
              }}
            />
          </p>
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-all duration-200 font-medium shadow-lg">
            <LanguageText
              texts={{
                "zh-CN": "立即登录",
                "zh-TW": "立即登錄",
                en: "Login Now",
              }}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] bg-white dark:bg-dark-primary shadow-xl overflow-hidden flex border border-neutral-200/50 dark:border-zinc-700/50 rounded-lg chat-page-container">
      {" "}
      {/* 左侧联系人列表 */}
      <div className="w-80 bg-gradient-to-b from-white to-neutral-50 dark:from-dark-secondary dark:to-zinc-800/50 border-r border-neutral-200 dark:border-zinc-700 flex flex-col">
        {/* 顶部标题 */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 dark:border-zinc-700 bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-sm flex-shrink-0">
          <h1 className="text-lg font-bold text-neutral-800 dark:text-white">
            <LanguageText
              texts={{
                "zh-CN": "聊天",
                "zh-TW": "聊天",
                en: "Chat",
              }}
            />
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              <LanguageText
                texts={{
                  "zh-CN": "在线",
                  "zh-TW": "在線",
                  en: "Online",
                }}
              />
            </span>
          </div>
        </div>

        {/* 联系人列表 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contactsLoading ? (
            /* 加载状态 */
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 animate-pulse"
                >
                  <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : contacts.length === 0 ? (
            /* 空状态 */
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 text-center text-sm leading-relaxed">
                <LanguageText
                  texts={{
                    "zh-CN": "还没有聊天记录\n快去找朋友聊天吧",
                    "zh-TW": "還沒有聊天記錄\n快去找朋友聊天吧",
                    en: "No chat history yet\nStart chatting with friends",
                  }}
                />
              </p>
            </div>
          ) : (
            /* 联系人列表 */
            <div className="py-3">
              {contacts.map((contact) => (
                <div
                  key={contact.userId}
                  onClick={(e) => handleSelectContact(contact, e)}
                  className={`chat-contact-item flex items-center space-x-3 px-4 py-3 mx-2 cursor-pointer transition-colors duration-200 rounded-lg group ${
                    selectedContact?.userId === contact.userId
                      ? "bg-primary/10 border-l-4 border-primary shadow-sm"
                      : "hover:bg-neutral-100/80 dark:hover:bg-neutral-700/50"
                  }`}
                  style={{ minHeight: "72px" }} // 确保联系人项高度一致
                >
                  {/* 头像 */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        contact.avatarUrl ||
                        "/images/avatars/default-avatar.svg"
                      }
                      alt={contact.username}
                      className="w-12 h-12 rounded-full ring-2 ring-white dark:ring-dark-secondary shadow-sm group-hover:ring-primary/20 transition-all duration-200"
                    />
                    {/* 在线状态指示器 */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-dark-secondary"></div>
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-neutral-800 dark:text-white truncate group-hover:text-primary transition-colors duration-200">
                        {contact.nickname || contact.username}
                      </h3>
                      {contact.lastMessageTime && (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                          {formatPostTime(contact.lastMessageTime)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                        {contact.lastMessage || (
                          <span className="italic text-neutral-400">
                            <LanguageText
                              texts={{
                                "zh-CN": "开始聊天...",
                                "zh-TW": "開始聊天...",
                                en: "Start chatting...",
                              }}
                            />
                          </span>
                        )}
                      </p>
                      {contact.unreadCount && contact.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium shadow-sm animate-pulse">
                          {contact.unreadCount > 99
                            ? "99+"
                            : contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* 右侧聊天区域 */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-neutral-50 to-white dark:from-dark-primary dark:to-zinc-900/50 min-w-0">
        {selectedContact ? (
          <>
            {/* 聊天顶部信息 */}
            <div className="h-16 bg-white/90 dark:bg-dark-secondary/90 backdrop-blur-sm border-b border-neutral-200 dark:border-zinc-700 flex items-center justify-between px-6 shadow-sm flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={
                      selectedContact.avatarUrl ||
                      "/images/avatars/default-avatar.svg"
                    }
                    alt={selectedContact.username}
                    className="w-10 h-10 rounded-full ring-2 ring-primary/20"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-secondary"></div>
                </div>
                <div>
                  <h2 className="font-medium text-neutral-800 dark:text-white">
                    {selectedContact.nickname || selectedContact.username}
                  </h2>
                  <p className="text-sm text-green-500 font-medium">
                    <LanguageText
                      texts={{
                        "zh-CN": "在线",
                        "zh-TW": "在線",
                        en: "Online",
                      }}
                    />
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="p-2 text-neutral-500 hover:text-primary dark:text-neutral-400 dark:hover:text-primary rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </button>
                <button className="p-2 text-neutral-500 hover:text-primary dark:text-neutral-400 dark:hover:text-primary rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button className="p-2 text-neutral-500 hover:text-primary dark:text-neutral-400 dark:hover:text-primary rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar chat-messages-container">
              {messagesLoading ? (
                /* 消息加载状态 */
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        index % 2 === 0 ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className="flex items-end space-x-2 max-w-xs animate-pulse">
                        {index % 2 !== 0 && (
                          <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                        )}
                        <div className="bg-neutral-200 dark:bg-neutral-700 h-10 rounded-2xl px-4 py-2 flex-1"></div>
                        {index % 2 === 0 && (
                          <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                /* 无消息状态 */
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-6">
                    <svg
                      className="w-10 h-10 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2">
                    <LanguageText
                      texts={{
                        "zh-CN": "开始对话",
                        "zh-TW": "開始對話",
                        en: "Start Conversation",
                      }}
                    />
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-center">
                    <LanguageText
                      texts={{
                        "zh-CN": "发送你们的第一条消息吧",
                        "zh-TW": "發送你們的第一條消息吧",
                        en: "Send your first message",
                      }}
                    />
                  </p>
                </div>
              ) : (
                /* 消息列表 */
                <>
                  {messages.map((message, index) => {
                    const isFromMe = message.fromUserId === user.userId;
                    const isSystemMessage =
                      message.isSystemMessage ||
                      message.fromUserId === "system";

                    // 系统消息特殊样式
                    if (isSystemMessage) {
                      return (
                        <div
                          key={message.messageId}
                          className="flex justify-center animate-fadeIn"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-2 max-w-md mx-4">
                            <div className="flex items-center space-x-2">
                              <svg
                                className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                />
                              </svg>
                              <span className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                                {message.content}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // 普通消息
                    return (
                      <div
                        key={message.messageId}
                        className={`chat-message-container ${
                          isFromMe ? "from-me" : "from-other"
                        } animate-fadeIn`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* 头像 - 使用统一的chat-avatar类 */}
                        <img
                          src={
                            isFromMe
                              ? (user as any).avatar ||
                                (user as any).avatarUrl ||
                                "/images/avatars/default-avatar.svg"
                              : selectedContact.avatarUrl ||
                                "/images/avatars/default-avatar.svg"
                          }
                          alt="avatar"
                          className="chat-avatar"
                        />

                        {/* 消息气泡 - 使用统一的chat-bubble类 */}
                        <div
                          className={`chat-bubble ${
                            isFromMe ? "from-me" : "from-other"
                          } ${
                            message.msgType === "image" ? "image-message" : ""
                          } ${
                            message.status === "sending"
                              ? "message-status-sending"
                              : message.status === "sent"
                              ? "message-status-sent"
                              : ""
                          }`}
                        >
                          {/* 消息内容 */}
                          <div className="chat-bubble-content">
                            {message.msgType === "text" ? (
                              message.content
                            ) : message.msgType === "image" ? (
                              /* 图片消息特殊处理 */
                              <div className="space-y-2">
                                {(() => {
                                  // 从content中提取图片URL
                                  const lines = message.content.split("\n");
                                  let imageUrl = "";
                                  let description = "";
                                  let fileName = "";

                                  // 查找URL行和文件信息
                                  for (let i = 0; i < lines.length; i++) {
                                    const line = lines[i].trim();
                                    if (
                                      line.startsWith("http://") ||
                                      line.startsWith("https://")
                                    ) {
                                      imageUrl = line;
                                    } else if (line.includes("[图片]")) {
                                      // 提取文件名
                                      const match =
                                        line.match(/\[图片\]\s*(.+)/);
                                      if (match) {
                                        fileName = match[1];
                                      }
                                    } else if (
                                      line &&
                                      !line.includes("[图片]") &&
                                      !line.includes("正在上传")
                                    ) {
                                      description = line;
                                    }
                                  }

                                  return (
                                    <>
                                      {/* 图片显示 */}
                                      {imageUrl ? (
                                        <div className="relative rounded-lg overflow-hidden max-w-sm cursor-pointer group">
                                          <img
                                            src={imageUrl}
                                            alt={fileName || "聊天图片"}
                                            className="w-full h-auto max-h-64 object-cover transition-transform group-hover:scale-105"
                                            onClick={() => {
                                              // 点击图片放大查看
                                              const newWindow = window.open(
                                                "",
                                                "_blank"
                                              );
                                              if (newWindow) {
                                                newWindow.document.write(`
                                                  <html>
                                                    <head><title>图片查看 - ${
                                                      fileName || "图片"
                                                    }</title></head>
                                                    <body style="margin:0;padding:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;">
                                                      <img src="${imageUrl}" style="max-width:100%;max-height:100%;object-fit:contain;" />
                                                    </body>
                                                  </html>
                                                `);
                                              }
                                            }}
                                            onError={(e) => {
                                              // 图片加载失败时显示文件信息
                                              const target =
                                                e.target as HTMLImageElement;
                                              target.style.display = "none";
                                              const parent =
                                                target.parentElement;
                                              if (parent) {
                                                parent.innerHTML = `
                                                  <div class="flex items-center space-x-2 p-3 bg-neutral-100 dark:bg-neutral-700 rounded">
                                                    <svg class="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span class="text-sm text-neutral-600 dark:text-neutral-400">图片加载失败</span>
                                                  </div>
                                                `;
                                              }
                                            }}
                                          />
                                          {/* 图片遮罩层 */}
                                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                                            <svg
                                              className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-200"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                              />
                                            </svg>
                                          </div>
                                        </div>
                                      ) : (
                                        /* 图片上传中或失败的显示 */
                                        <div className="flex items-center space-x-2 p-3 bg-neutral-100 dark:bg-neutral-700 rounded">
                                          <svg
                                            className="w-5 h-5 text-neutral-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                          </svg>
                                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {fileName || message.content}
                                          </span>
                                        </div>
                                      )}

                                      {/* 图片描述文字 */}
                                      {description && (
                                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                          {description}
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            ) : (
                              /* 其他文件类型显示 */
                              (() => {
                                // 解析文件消息内容
                                const lines = message.content.split("\n");
                                let fileUrl = "";
                                let fileName = "";
                                let fileType = "";
                                let description = "";

                                // 解析消息内容
                                for (let i = 0; i < lines.length; i++) {
                                  const line = lines[i].trim();
                                  if (
                                    line.startsWith("http://") ||
                                    line.startsWith("https://")
                                  ) {
                                    fileUrl = line;
                                  } else if (
                                    line.includes("[") &&
                                    line.includes("]")
                                  ) {
                                    // 提取文件类型和文件名
                                    const match =
                                      line.match(/\[(.+?)\]\s*(.+)/);
                                    if (match) {
                                      fileType = match[1];
                                      fileName = match[2];
                                    }
                                  } else if (
                                    line &&
                                    !line.includes("正在上传")
                                  ) {
                                    description = line;
                                  }
                                }

                                // 根据文件扩展名确定图标和样式
                                const getFileIcon = (
                                  fileName: string,
                                  msgType: string
                                ) => {
                                  const ext =
                                    fileName.toLowerCase().split(".").pop() ||
                                    "";

                                  // 文档类型
                                  if (
                                    [
                                      "doc",
                                      "docx",
                                      "pdf",
                                      "txt",
                                      "rtf",
                                    ].includes(ext)
                                  ) {
                                    return (
                                      <svg
                                        className="w-6 h-6 text-blue-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                      </svg>
                                    );
                                  }

                                  // 压缩包类型
                                  if (
                                    ["zip", "rar", "7z", "tar", "gz"].includes(
                                      ext
                                    )
                                  ) {
                                    return (
                                      <svg
                                        className="w-6 h-6 text-orange-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                      </svg>
                                    );
                                  }

                                  // 表格类型
                                  if (["xls", "xlsx", "csv"].includes(ext)) {
                                    return (
                                      <svg
                                        className="w-6 h-6 text-green-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                      </svg>
                                    );
                                  }

                                  // 演示文档类型
                                  if (["ppt", "pptx"].includes(ext)) {
                                    return (
                                      <svg
                                        className="w-6 h-6 text-red-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v1M7 4V3a1 1 0 011-1h8a1 1 0 011 1v1m-9 4h10m-10 4h10m-10 4h6"
                                        />
                                      </svg>
                                    );
                                  }

                                  // 视频类型
                                  if (
                                    msgType === "video" ||
                                    [
                                      "mp4",
                                      "avi",
                                      "mov",
                                      "wmv",
                                      "flv",
                                      "webm",
                                      "mkv",
                                    ].includes(ext)
                                  ) {
                                    return (
                                      <svg
                                        className="w-6 h-6 text-purple-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                      </svg>
                                    );
                                  }

                                  // 音频类型
                                  if (
                                    msgType === "voice" ||
                                    [
                                      "mp3",
                                      "wav",
                                      "ogg",
                                      "m4a",
                                      "aac",
                                      "flac",
                                    ].includes(ext)
                                  ) {
                                    return (
                                      <svg
                                        className="w-6 h-6 text-indigo-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                        />
                                      </svg>
                                    );
                                  }

                                  // 默认文件图标
                                  return (
                                    <svg
                                      className="w-6 h-6 text-neutral-500"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                  );
                                };

                                return (
                                  <div className="space-y-2">
                                    {/* 文件信息卡片 */}
                                    <div
                                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                                        fileUrl
                                          ? "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                                          : "bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                                      }`}
                                      onClick={() => {
                                        if (fileUrl) {
                                          // 点击下载文件
                                          const link =
                                            document.createElement("a");
                                          link.href = fileUrl;
                                          link.download =
                                            fileName || "download";
                                          link.target = "_blank";
                                          document.body.appendChild(link);
                                          link.click();
                                          document.body.removeChild(link);
                                        }
                                      }}
                                    >
                                      {/* 文件图标 */}
                                      <div className="flex-shrink-0">
                                        {getFileIcon(fileName, message.msgType)}
                                      </div>

                                      {/* 文件信息 */}
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-neutral-800 dark:text-white truncate">
                                          {fileName || "文件"}
                                        </div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                          {fileType || message.msgType}
                                          {fileUrl
                                            ? " • 点击下载"
                                            : " • 上传中..."}
                                        </div>
                                      </div>

                                      {/* 下载图标 */}
                                      {fileUrl && (
                                        <div className="flex-shrink-0">
                                          <svg
                                            className="w-4 h-4 text-neutral-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </div>

                                    {/* 描述文字 */}
                                    {description && (
                                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {description}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()
                            )}
                          </div>

                          {/* 消息状态和时间 */}
                          <div className="chat-bubble-time">
                            <span>{formatPostTime(message.ctime)}</span>
                            {isFromMe && (
                              <>
                                {message.status === "sending" && (
                                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin opacity-60"></div>
                                )}
                                {message.status === "sent" && (
                                  <svg
                                    className="w-3 h-3 opacity-80"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* 消息输入框 */}
            <div className="bg-white/90 dark:bg-dark-secondary/90 backdrop-blur-sm border-t border-neutral-200 dark:border-zinc-700 p-4">
              <div className="flex items-center space-x-3 chat-input-container">
                {/* 文件发送按钮组 */}
                <div className="flex space-x-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!sendingFile) {
                        fileInputRef.current?.click();
                      }
                    }}
                    disabled={sendingFile}
                    className={`chat-input-button ${
                      sendingFile
                        ? "text-neutral-400 cursor-not-allowed"
                        : "text-neutral-500 hover:text-primary dark:text-neutral-400 dark:hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {sendingFile ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!sendingFile) {
                        fileInputRef.current?.click();
                      }
                    }}
                    disabled={sendingFile}
                    className={`chat-input-button ${
                      sendingFile
                        ? "text-neutral-400 cursor-not-allowed"
                        : "text-neutral-500 hover:text-primary dark:text-neutral-400 dark:hover:text-primary hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    }`}
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>

                {/* 文件输入框 - 隐藏 */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                />

                {/* 文本输入框 */}
                <div className="flex-1 relative">
                  <textarea
                    ref={messageInputRef}
                    value={messageInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="输入消息..."
                    disabled={sendingMessage || sendingFile}
                    className="w-full resize-none rounded-xl border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 custom-scrollbar disabled:opacity-50 disabled:cursor-not-allowed chat-input-textarea"
                    rows={1}
                  />
                </div>

                {/* 发送按钮 */}
                <button
                  onClick={handleSendMessage}
                  disabled={
                    (!messageInput.trim() && !sendingFile) || sendingMessage
                  }
                  className={`chat-send-button transition-all duration-200 ${
                    (!messageInput.trim() && !sendingFile) || sendingMessage
                      ? "bg-neutral-300 dark:bg-neutral-600 text-neutral-500 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {sendingMessage ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* 未选择联系人状态 */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-3">
                <LanguageText
                  texts={{
                    "zh-CN": "选择聊天对象",
                    "zh-TW": "選擇聊天對象",
                    en: "Select a Chat",
                  }}
                />
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <LanguageText
                  texts={{
                    "zh-CN": "从左侧列表中选择一个联系人\n开始愉快的聊天吧",
                    "zh-TW": "從左側列表中選擇一個聯絡人\n開始愉快的聊天吧",
                    en: "Choose a contact from the left\nto start chatting",
                  }}
                />
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
