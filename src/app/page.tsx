"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Upload, Trash2, Sun, Moon, Plus, Menu } from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [pdfText, setPdfText] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.onload = () => {
      // @ts-ignore
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getTimestamp = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    if (["clear", "clear chat", "delete"].includes(trimmedInput.toLowerCase())) {
      setMessages([]);
      setUploadedFileName("");
      setPdfText("");
      setInput("");
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      content: trimmedInput,
      timestamp: getTimestamp(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    const timeKeywords = ["time", "what time", "current time", "what's the time"];
    const isTimeQuery = timeKeywords.some((kw) =>
      trimmedInput.toLowerCase().includes(kw)
    );

    if (isTimeQuery) {
      const timeResponse: Message = {
        id: Date.now() + 1,
        sender: "ai",
        content: `The current time is ${new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}.`,
        timestamp: getTimestamp(),
      };
      setMessages((prev) => [...prev, timeResponse]);
      setIsTyping(false);
      return;
    }

    const fullMessage = trimmedInput + (pdfText ? `\n\n${pdfText}` : "");

    const apiFormattedMessages = [
      ...updatedMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
      {
        role: "user",
        parts: [{ text: fullMessage }],
      },
    ];

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyANML0UbWBb03sm1FrV1JBpOpGXhm5vS4M",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contents: apiFormattedMessages }),
        }
      );

      const data = await response.json();
      let aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "Sorry, I couldn't understand that.";

      aiText = aiText.replace(/\*/g, "");

      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        content: aiText,
        timestamp: getTimestamp(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          content: "There was an error fetching the response.",
          timestamp: getTimestamp(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePDFUpload = async (file: File) => {
    if (!file || !file.type.includes("pdf")) return;

    setUploadedFileName(file.name);
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);

      // @ts-ignore
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        fullText += strings.join(" ") + "\n";
      }

      setPdfText(fullText);
    };
    fileReader.readAsArrayBuffer(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePDFUpload(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handlePDFUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleNewChat = () => {
    setMessages([]);
    setUploadedFileName("");
    setPdfText("");
  };

  return (
    <div className={`flex h-screen w-full ${isDarkMode ? "bg-gray-900 text-white" : "bg-blue-300 text-black"} transition-colors duration-300`}>
      {showSidebar && (
        <div className={`w-60 border-r px-4 py-4 flex flex-col gap-4 ${isDarkMode ? "border-gray-700 bg-gray-800" : "bg-white border-gray-300"}`}>
          <span className="flex">
          <div className="mb-4 w-fit">
            <h1 className="text-3xl font-bold">chitchat</h1>
            <p className="text-xs italic text-gray-400 dark:text-gray-300">An AI Powered Chatbot</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-gray-700 justify-center dark:text-white hover:text-yellow-500 ml-auto cursor-pointer"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          </span>
          <Button variant="default" onClick={handleNewChat} className="flex items-center gap-2 text-sm cursor-pointer">
            <Plus size={16} /> New Chat
          </Button>
        </div>
      )}

      <div className="flex flex-col flex-1 px-4 py-4 overflow-hidden">
        <Button variant="default" size="sm" onClick={() => setShowSidebar(!showSidebar)} className="mb-2 w-fit rounded-md cursor-pointer">
          <Menu size={18} />
        </Button>

        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`flex flex-col h-full border rounded-xl shadow ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-background border-black"} p-2 m-1 transition-colors duration-300 overflow-hidden`}
        >
          <div className="flex justify-between items-center border-b pb-3 border-gray-400 dark:border-gray-600">
            <div className="text-lg font-semibold w-full text-left pl-2">Chat</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewChat}
              className="text-gray-500 hover:text-red-500 dark:text-white cursor-pointer"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <CardContent className="flex-1 overflow-y-auto px-2 max-h-full">
            <ScrollArea className="space-y-3 pr-2">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex p-2 shadow ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 rounded-2xl max-w-[75%] text-sm shadow-md whitespace-pre-wrap break-words overflow-x-auto relative ${
                      msg.sender === "user"
                        ? "bg-blue-300 text-black"
                        : isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {msg.content}
                    <div className="text-[10px] text-right mt-1 text-gray-500">{msg.timestamp}</div>
                  </motion.div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                    className="p-3 rounded-2xl bg-accent text-accent-foreground text-sm shadow-md"
                  >
                    Typing...
                  </motion.div>
                </div>
              )}
              <div ref={bottomRef} />
            </ScrollArea>
          </CardContent>

          {uploadedFileName && (
            <div className="px-4 py-1 text-xs text-gray-600 dark:text-gray-300">
              Uploaded: {uploadedFileName}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="mt-2 flex flex-col sm:flex-row items-center gap-2 border-t pt-2 justify-between w-full border-gray-300 dark:border-gray-600"
          >
            <label className="flex items-center gap-2 cursor-pointer bg-gray-100 border rounded px-2 py-1 text-sm text-black hover:bg-gray-200 dark:text-white dark:bg-black dark:border-white dark:hover:bg-gray-600">
              <Upload size={16} />
              <span>Upload PDF</span>
              <input type="file" accept="application/pdf" onChange={handleFileInputChange} className="hidden" />
            </label>

            <Input
              ref={inputRef}
              placeholder="Bolo kya hua 🦋..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isTyping} className="dark:border-white dark:text-white cursor-pointer">
              {isTyping ? "..." : "Send"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}





// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { CardContent } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { motion } from "framer-motion";
// import { Upload, Trash2, Sun, Moon, Plus, Menu } from "lucide-react";

// interface Message {
//   id: number;
//   sender: "user" | "ai";
//   content: string;
//   timestamp: string;
// }

// export default function Chatbot() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState<string>("");
//   const [isTyping, setIsTyping] = useState<boolean>(false);
//   const [uploadedFileName, setUploadedFileName] = useState<string>("");
//   const [pdfText, setPdfText] = useState<string>("");
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
//   const [showSidebar, setShowSidebar] = useState<boolean>(true);
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src =
//       "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
//     script.onload = () => {
//       // @ts-ignore
//       pdfjsLib.GlobalWorkerOptions.workerSrc =
//         "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
//     };
//     document.body.appendChild(script);
//   }, []);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   const getTimestamp = () =>
//     new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//   const handleSend = async () => {
//     const trimmedInput = input.trim();
//     if (!trimmedInput) return;

//     const userMessage: Message = {
//       id: Date.now(),
//       sender: "user",
//       content: trimmedInput,
//       timestamp: getTimestamp(),
//     };

//     const updatedMessages = [...messages, userMessage];
//     setMessages(updatedMessages);
//     setInput("");
//     setIsTyping(true);

//     // Prepare history for Gemini API
//     const history = updatedMessages.map((msg) => ({
//       role: msg.sender === "user" ? "user" : "model",
//       parts: [{ text: msg.content }],
//     }));

//     // Append PDF context if available to the last message
//     if (pdfText) {
//       history[history.length - 1].parts[0].text +=
//         `\n\nContext from PDF: ${pdfText}`;
//     }

//     try {
//       const response = await fetch(
//         "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyANML0UbWBb03sm1FrV1JBpOpGXhm5vS4M",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ contents: history }),
//         },
//       );

//       const data = await response.json();
//       const aiText =
//         data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//         "No response received.";

//       const aiMessage: Message = {
//         id: Date.now() + 1,
//         sender: "ai",
//         content: aiText,
//         timestamp: getTimestamp(),
//       };

//       setMessages((prev) => [...prev, aiMessage]);
//     } catch (error) {
//       console.error("API Error:", error);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handlePDFUpload = async (file: File) => {
//     if (!file || !file.type.includes("pdf")) return;
//     setUploadedFileName(file.name);
//     const fileReader = new FileReader();
//     fileReader.onload = async () => {
//       const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
//       // @ts-ignore
//       const pdf = await pdfjsLib.getDocument(typedArray).promise;
//       let fullText = "";
//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const content = await page.getTextContent();
//         fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
//       }
//       setPdfText(fullText);
//     };
//     fileReader.readAsArrayBuffer(file);
//   };

//   return (
//     <div
//       className={`flex h-screen w-full ${isDarkMode ? "bg-gray-900 text-white" : "bg-blue-300 text-black"}`}
//     >
//       {showSidebar && (
//         <div
//           className={`w-60 border-r px-4 py-4 flex flex-col gap-4 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
//         >
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold">chitchat</h1>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsDarkMode(!isDarkMode)}
//             >
//               {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
//             </Button>
//           </div>
//           <Button onClick={() => setMessages([])} className="flex gap-2">
//             <Plus size={16} /> New Chat
//           </Button>
//         </div>
//       )}

//       <div className="flex flex-col flex-1 p-4 overflow-hidden">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => setShowSidebar(!showSidebar)}
//           className="mb-2 w-fit"
//         >
//           <Menu size={18} />
//         </Button>

//         <div
//           className={`flex flex-col h-full border rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-black"} overflow-hidden`}
//         >
//           <CardContent className="flex-1 overflow-hidden p-0">
//             <ScrollArea className="h-full p-4">
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`flex mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//                 >
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white"}`}
//                   >
//                     {msg.content}
//                     <div className="text-[10px] opacity-70 text-right mt-1">
//                       {msg.timestamp}
//                     </div>
//                   </motion.div>
//                 </div>
//               ))}
//               {isTyping && (
//                 <div className="text-xs italic opacity-50">
//                   AI is thinking...
//                 </div>
//               )}
//               <div ref={bottomRef} />
//             </ScrollArea>
//           </CardContent>

//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleSend();
//             }}
//             className="p-4 border-t flex flex-col gap-2"
//           >
//             {uploadedFileName && (
//               <div className="text-xs text-blue-500">📎 {uploadedFileName}</div>
//             )}
//             <div className="flex gap-2">
//               <label className="p-2 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
//                 <Upload size={18} />
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={(e) =>
//                     e.target.files?.[0] && handlePDFUpload(e.target.files[0])
//                   }
//                   className="hidden"
//                 />
//               </label>
//               <Input
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Type a message..."
//                 className="flex-1"
//               />
//               <Button type="submit" disabled={isTyping}>
//                 Send
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
