"use client";

import { useEffect, useState } from "react";

import OpenAI from "openai";

import { useQuery } from "@apollo/client";

import { GET_CHARACTER } from "@/graphql/queries";

interface Message {
  role: "user" | "assistant" | "system";
  content: string | null;
}

interface OpenAIChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export default function Form({ id }: any) {
  const { error, loading, data } = useQuery(GET_CHARACTER, {
    variables: { id },
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");

  const handleUserInput = async (input: string) => {
    // Add user message to chat
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);

    // Call OpenAI API
    const openai = new OpenAI({ apiKey: process.env.OPEN_AI_TOKEN }); // Ensure you have appropriate API key setup

    // Transform messages to the type expected by OpenAI's API
    const openAIMessages: any = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    try {
      const completion = await openai.chat.completions.create({
        messages: [...openAIMessages, { role: "user", content: input }],
        model: "gpt-3.5-turbo",
      });

      // ... rest of your code
    } catch (error) {
      // ... error handling
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleUserInput(userInput);
    setUserInput(""); // Clear input field
  };

  useEffect(() => {
    if (data) {
      const { Character } = data;
      const { name, image, description } = Character;

      const animeTitle = Character?.media?.nodes[0]?.title?.english;

      const htmlToText = (html: any) => {
        // Create a new div element
        const tempDivElement = document.createElement("div");

        // Set the HTML content with the provided
        tempDivElement.innerHTML = html;

        // Retrieve the text property of the element (cross-browser support)
        return tempDivElement.textContent || tempDivElement.innerText || "";
      };
      const characterDescription = htmlToText(description);

      const initialAIPrompt = `You are a character from the anime, ${animeTitle} and your name is ${name.full}. ${characterDescription}. Now greet, act and converse with the user like you are ${name.full}.`;

      console.log(data);
      // Initialize conversation with system message
      setMessages([{ role: "system", content: initialAIPrompt }]);
    }
  }, [data]);
  if (loading) return "loading...";
  if (error) {
    console.log(error, "error");
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <p key={index}>
            <b>{message.role}:</b> {message.content}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
