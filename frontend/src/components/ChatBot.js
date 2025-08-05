import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Box, Button, Typography, Stack, Paper } from "@mui/material";
const predefinedQuestions = [
    { question: "How do I use this app?", type: "static", answer: "Use the demo by typing in 'test_1' and clicking Load Debts. Or create your own user, add debts, set your monthly payment, and hit Calculate."
    },
    { question: "What is the debt snowball method?", type: "ai" },
    { question: "Why did Yuhsuan build this app?", type: "static", answer: "I built this app to To help people manage debt smarter and learn fullstack development using modern tools including React, Python, FastAPI, PostgreSQL, and OpenAI API integration." },
    { question: "Can I upload my bank statement to have a monthly spending analysis and advises?", type: "static", answer: "Stay tuned for the new feature! I plan to add a feature that allows users to upload their bank statements for monthly spending analysis and personalized advice, the tricky part is to ensure privacy safety and how to redact personal information." },
];
const ChatBot = () => {
    const [chatLog, setChatLog] = useState([]);
    const [input, setInput] = useState("");
    const sendMessage = async (message, type, answer) => {
        setChatLog((prev) => [...prev, `: ${message}`]);
        if (type === "static" && answer) {
            setChatLog((prev) => [...prev, `: ${answer}`]);
        }
        else {
            try {
                const res = await fetch("https://debt-snow-ball-fastapi.onrender.com/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message })
                });
                const data = await res.json();
                setChatLog((prev) => [...prev, `: ${data.reply}`]);
            }
            catch (err) {
                setChatLog((prev) => [...prev, `: Something went wrong.`]);
            }
        }
    };
    return (_jsxs(Paper, { elevation: 3, sx: { p: 2, mb: 2 }, children: [_jsx(Typography, { variant: "h6", sx: { mb: 1 }, children: " Chat with DebtBot" }), _jsx(Stack, { direction: "row", spacing: 1, flexWrap: "wrap", mb: 2, children: predefinedQuestions.map((item, idx) => (_jsx(Button, { variant: "outlined", size: "small", onClick: () => sendMessage(item.question, item.type, item.answer), children: item.question }, idx))) }), _jsx(Box, { sx: {
                    maxHeight: 200, // adjust height as needed
                    overflowY: "auto",
                    mb: 1,
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    p: 1,
                }, children: _jsx(Stack, { spacing: 1, children: chatLog.map((line, idx) => (_jsx(Typography, { variant: "body2", children: line }, idx))) }) })] }));
};
export default ChatBot;
