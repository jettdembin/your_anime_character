"use client";

import { useEffect, useRef, useState } from "react";

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

export default function Form({ id, firstMessage }: any) {
  const { error, loading, data } = useQuery(GET_CHARACTER, {
    variables: { id },
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");

  const handleUserInput = async (input: string) => {
    // Add user message to chat
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);

    // // Call OpenAI API
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Ensure you have appropriate API key setup

    // const data = await fetch("/api/characters", {}).then((res) => res.json());

    // Transform messages to the type expected by OpenAI's API
    const openAIMessages: any = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // try {
    //   const completion = await openai.chat.completions.create({
    //     messages: [...openAIMessages, { role: "user", content: input }],
    //     model: "gpt-3.5-turbo",
    //   });

    //   // ... rest of your code
    // } catch (error) {
    //   // ... error handling
    // }
    try {
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...openAIMessages, { role: "user", content: input }],
        }),
      });

      const data = await response.json();
      const recentRespone = data.choices[0].message;
      setMessages((msgs) => [...msgs, recentRespone]);
    } catch (error) {
      // ... handle any errors ...
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleUserInput(userInput);
    setUserInput(""); // Clear input field
  };

  const isFirstMount = useRef(true);
  useEffect(() => {
    if (data && isFirstMount.current) {
      const { Character } = data;
      const { name, description } = Character; // Removed 'image' as it's not used in your current code

      const animeTitle = Character?.media?.nodes[0]?.title?.english;

      const htmlToText = (html: any) => {
        const tempDivElement = document.createElement("div");
        tempDivElement.innerHTML = html;
        return tempDivElement.textContent || tempDivElement.innerText || "";
      };

      const characterDescription = htmlToText(description);

      const initialAIPrompt = `You are a character from the anime ${animeTitle}, and your name is ${name.full}. ${characterDescription}. Now greet, act and converse with the user as if you are ${name.full}.`;

      const fetchAPI = async () => {
        try {
          const response = await fetch("/api/characters", {
            // Adjusted URL to a more typical Next.js API route
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [{ role: "system", content: initialAIPrompt }],
            }),
          });

          const apiData = await response.json();
          const recentRespone = apiData.choices[0].message.content;
          setMessages((msgs) => [
            ...msgs,
            { role: "assistant", content: recentRespone }, // Make sure the 'message' property exists in your API response
          ]);
          debugger;
          isFirstMount.current = false;
        } catch (error) {
          console.error("Error fetching data: ", error);
          setMessages((msgs) => [
            ...msgs,
            { role: "assistant", content: "Error fetching character data." },
          ]);
          debugger;
        }
      };

      fetchAPI();
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
