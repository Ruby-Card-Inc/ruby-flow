import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Plus } from "lucide-react";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { addNodeDB, db } from "@/instant";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true,
});

export function ChatModal({ isOpen, setIsOpen }) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any>([]);
  const [showSuggestButton, setShowSuggestButton] = useState(false);
  const chatEndRef = useRef<any>(null);

  const {
    isLoading: nodesLoading,
    error: nodesError,
    data: nodesData,
  } = db.useQuery({ nodes: {} });

  const {
    isLoading: edgesLoading,
    error: edgesError,
    data: edgesData,
  } = db.useQuery({ edges: {} });

  const NodeResponse = z.object({
    label: z.string(),
    data: z.object({
      task: z.string(),
      title: z.string(),
      confidence: z.number(),
    }),
    type: z.literal("AINode"),
    nodeTypes: z.literal("AINode"),
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async () => {
    if (message.trim() === "") return;

    setChatHistory((prev) => [...prev, { role: "user", content: message }]);

    const aiResponse =
      "I can suggest a node based on your input. Would you like me to do that?";

    setChatHistory((prev) => [
      ...prev,
      { role: "assistant", content: aiResponse },
    ]);

    setShowSuggestButton(true);
    setMessage("");
  };

  const handleSuggestNode = useCallback(async () => {
    if (nodesLoading || edgesLoading) {
      console.log("Data is still loading");
      return;
    }

    if (nodesError || edgesError) {
      console.error("Error loading data:", nodesError || edgesError);
      return;
    }

    const currentNodes: any[] = nodesData?.nodes || [];
    const currentEdges = edgesData?.edges || [];

    const prompt = `Given a flow chart with the following nodes:
    ${
      currentNodes
        .map(
          (node) => `${node?.label ?? "No Label"} (ID: ${node?.id ?? "No ID"})`
        )
        .join(", ") || "No nodes available"
    }
    And connections:
    ${
      currentEdges
        .map((edge) => `${edge?.source} -> ${edge?.target}`)
        .join(", ") || "No connections available"
    }
    Suggest a new nodes that would enhance this flow chart. You will return a structured response with the following format. The label is the title of the new node you suggest. The data json will have 3 keys to fill in, a confidence you rate from 0 to 1 on how confident you think your new node fits in, the detailed task that this new node in the flow chart achieves, and the title of the node reiterated.`;

    console.log(prompt);

    try {
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Extract the event information." },
          { role: "user", content: prompt },
        ],
        response_format: zodResponseFormat(NodeResponse, "event"),
      });

      const event = completion.choices[0].message.parsed;
      console.log(event);

      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've added a ${event?.label} progress node to your flow.`,
        },
      ]);
      // Add the new node to the database
      const data = {
        data: event?.data,
        dragging: true,
        label: event?.label,
        node_type: event?.type,
        position: { x: 0, y: 0 },
        type: event?.type,
        selected: false,
      };
      addNodeDB(data);

      setShowSuggestButton(false);
    } catch (error) {
      console.error("Error suggesting nodes:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error while suggesting nodes.",
        },
      ]);
    }
  }, [
    nodesData,
    edgesData,
    nodesLoading,
    edgesLoading,
    nodesError,
    edgesError,
  ]);

  if (nodesLoading || edgesLoading) {
    return <div>Loading...</div>;
  }

  if (nodesError || edgesError) {
    return <div>Error: {(nodesError || edgesError)?.message}</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="mr-2" />
            Chat with AI
          </DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto mb-4 pr-4">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {showSuggestButton && (
            <div className="flex justify-start mb-4">
              <Button
                onClick={handleSuggestNode}
                variant="outline"
                className="flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                Suggest Node
              </Button>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="flex items-center">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-grow mr-2"
          />
          <Button onClick={handleSend} className="px-3 py-2">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
