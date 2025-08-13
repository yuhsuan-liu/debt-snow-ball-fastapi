import { useState } from "react";
import { Button, Typography } from "@mui/material";
import styles from './ChatBot.module.css';

const predefinedQuestions = [
    { question: "How do I use this app?", type: "static", answer: "Use the demo by typing in 'test_1' and clicking Load Debts. Or create your own user, add debts, set your monthly payment, and hit Calculate."
 },
  { question: "What is the debt snowball method?", type: "ai" },
  { question: "Why did Yuhsuan build this app?", type: "static", answer: "I built this app to To help people manage debt smarter and learn fullstack development using modern tools including React, Python, FastAPI, PostgreSQL, and OpenAI API integration." },
  { question: "Can I upload my bank statement to have a monthly spending analysis and advises?", type: "static", answer: "Stay tuned for the new feature! I plan to add a feature that allows users to upload their bank statements for monthly spending analysis and personalized advice, the tricky part is to ensure privacy safety and how to redact personal information." },
];

const ChatBot = () => {
  const [chatLog, setChatLog] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async (message: string, type: "static" | "ai", answer?: string) => {
    setChatLog((prev) => [...prev, `: ${message}`]);
    if (type === "static" && answer) {
      setChatLog((prev) => [...prev, `: ${answer}`]);
    } else {
      try {
        const res = await fetch("https://debt-snow-ball-fastapi.onrender.com/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        });
        const data = await res.json();
        setChatLog((prev) => [...prev, `: ${data.reply}`]);
      } catch (err) {
        setChatLog((prev) => [...prev, `: Something went wrong.`]);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        🤖 Chat with DebtBot
      </Typography>

      <div className={styles.buttonContainer}>
        {predefinedQuestions.map((item, idx) => (
          <Button
            key={idx}
            variant="outlined"
            size="small"
            onClick={() => sendMessage(item.question, item.type as any, item.answer)}
            className={styles.questionButton}
          >
            {item.question}
          </Button>
        ))}
      </div>

      <div className={styles.chatContainer}>
        {chatLog.length === 0 ? (
          <Typography variant="body2" className={styles.emptyMessage}>
            Click a question above to start chatting! 💬
          </Typography>
        ) : (
          chatLog.map((line, idx) => (
            <Typography
              key={idx}
              variant="body2"
              className={styles.chatMessage}
            >
              {line}
            </Typography>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatBot;