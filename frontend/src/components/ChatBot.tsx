import { useState } from "react";
import { Box, Button, TextField, Typography, Stack, Paper } from "@mui/material";

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
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}> Chat with DebtBot</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
        {predefinedQuestions.map((item, idx) => (
          <Button
            key={idx}
            variant="outlined"
            size="small"
            onClick={() => sendMessage(item.question, item.type as any, item.answer)}
          >
            {item.question}
          </Button>
        ))}
      </Stack>
        <Box
        sx={{
            maxHeight: 200, // adjust height as needed
            overflowY: "auto",
            mb: 1,
            border: "1px solid #ccc",
            borderRadius: 1,
            p: 1,
        }}
        >
        <Stack spacing={1}>
            {chatLog.map((line, idx) => (
            <Typography key={idx} variant="body2">{line}</Typography>
            ))}
        </Stack>
        </Box>
    </Paper>
  );
};

export default ChatBot;