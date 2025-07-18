import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { UserAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatItemProps {
  content: string;
  role: "user" | "assistant";
  imageUrl?: string; // Optional image URL prop
}

function extractCodeFromString(message: string) {
  if (message.includes("```")) {
    const blocks = message.split("```");
    return blocks.filter((block) => block.trim() !== ""); // Filter out empty blocks
  }
  return [message]; // Return an array containing the original message if no code block is found
}

function isCodeBlock(str: string) {
  return (
    str.includes("=") ||
    str.includes(";") ||
    str.includes("[") ||
    str.includes("]") ||
    str.includes("{") ||
    str.includes("}") ||
    str.includes("#") ||
    str.includes("//")
  );
}

const ChatItem: React.FC<ChatItemProps> = ({ content, role, imageUrl }) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = UserAuth();
  const userInitial = auth?.user?.name ? auth.user.name[0].toUpperCase() : "?";

  return (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: role === "assistant" ? "#004d5612" : "#51538f",
        gap: 2,
        borderRadius: 2,
        my: 1,
        maxWidth: "600px",
        wordBreak: "break-word",
        alignItems: "flex-start",
      }}
    >
      {/* Avatar Section */}
      <Box>
        <Avatar
          sx={{
            ml: "0",
            bgcolor: role === "assistant" ? "transparent" : "black",
            color: role === "assistant" ? "inherit" : "white",
          }}
        >
          {role === "assistant" ? (
            <img
              src="johnnychat.png"
              alt="johnnychat"
              width={"40px"}
              style={{ borderRadius: "50%" }}
            />
          ) : (
            userInitial
          )}
        </Avatar>
      </Box>

      {/* Content Section */}
      <Box sx={{ flex: 1 }}>
        {/* Show Image if Provided */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              borderRadius: "8px",
              marginBottom: "10px",
              objectFit: "cover",
            }}
          />
        )}

        {/* Text or Code Content */}
        {messageBlocks.map((block, index) =>
          isCodeBlock(block) ? (
            <Box
              key={index}
              sx={{
                maxHeight: "300px",
                overflowY: "auto",
                bgcolor: "#1e1e1e",
                borderRadius: 1,
                p: 1,
                mb: 1,
              }}
            >
              <SyntaxHighlighter style={coldarkDark} language="javascript">
                {block}
              </SyntaxHighlighter>
            </Box>
          ) : (
            <Typography key={index} sx={{ fontSize: "16px", wordBreak: "break-word" }}>
              {block}
            </Typography>
          )
        )}
      </Box>
    </Box>
  );
};

export default ChatItem;
