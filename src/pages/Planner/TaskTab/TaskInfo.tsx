// @ts-nocheck
import markdownIt from "markdown-it";
import { useEffect, useRef, useState } from "react";
import { textDirection } from "../../../functions/textDirection";
import { Box, Button, IconButton } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import "./TaskInfo.css";
import { useUtilsStore } from "../../../store";

const TaskInfo: React.FC<{
  task?: { [key: string]: any };
  directInfo?: string;
}> = ({ task, directInfo }) => {
  const { hideContent } = useUtilsStore((state) => state);

  const [showMore, setShowMore] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const markdown = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
  }).use((md) => {
    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const href = token.attrGet("href");
      token.attrSet("target", "_blank");
      return self.renderToken(tokens, idx, options, env, self);
    };
  });

  useEffect(() => {
    if (contentRef.current) {
      // Check if content height is more than 100px
      setIsOverflowing(contentRef.current.scrollHeight > 70);
    }
  }, [task?.description, directInfo]);

  if (task?.description || directInfo) {
    return (
      <AnimatePresence>
        <Box sx={{ position: "relative" }}>
          <div
            className={`rendered-markdown-container read-more-content ${
              showMore && isOverflowing
                ? "read-less-container"
                : "read-more-container"
            }`}
            style={{
              fontSize: "smaller",
              textAlign: textDirection(task?.description || directInfo || ""),
              paddingRight: 20,
              paddingLeft: 20,
              marginRight:
                textDirection(task?.description || directInfo) === "right"
                  ? -8
                  : 0,
              marginLeft:
                textDirection(task?.description || directInfo) === "left"
                  ? -8
                  : 0,
            }}
            onClick={() => setShowMore(!showMore)}
          >
            <div
              style={{ filter: hideContent ? "blur(4px)" : "none" }}
              ref={contentRef}
              dangerouslySetInnerHTML={{
                __html: markdown.render(task?.description || directInfo || ""),
              }}
            />
          </div>
          {isOverflowing && (
            <IconButton
              size="small"
              onClick={() => setShowMore(!showMore)}
              sx={{
                position: "absolute",
                // bottom: showMore ? 18 : -2,
                bottom: -5,
                right: 5,
                transform: showMore ? "rotate(0)" : "rotate(180deg)",
                transition: "transform 0.2s ease-in-out",
              }}
            >
              <KeyboardArrowDown />
            </IconButton>
          )}
        </Box>
      </AnimatePresence>
    );
  }
};

export default TaskInfo;
