import "./Editor.css";
import "@mdxeditor/editor/style.css";
import {
  BlockTypeSelect,
  CodeToggle,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  tablePlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  frontmatterPlugin,
  InsertFrontmatter,
  imagePlugin,
  InsertImage,
  MDXEditorMethods,
} from "@mdxeditor/editor";
import { useRef, useState } from "react";
import { Box, Button } from "@mui/material";

export default function MarkDownEditor() {
  const editorRef = useRef<MDXEditorMethods>(null);
  const timeoutRef = useRef<number | null>(null);
  const [desc, setDesc] = useState<string>(
    `
    This is an example description
    Firest
    second
    `
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Button onClick={() => console.log(desc)}>Log Markdown</Button>
      <MDXEditor
        ref={editorRef}
        markdown={desc}
        onChange={(value) => {
          // Clear the previous timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Set a new timeout to mark "stopped typing"
          timeoutRef.current = window.setTimeout(() => {
            setDesc(value);
          }, 1000); // 1 second delay after the last keystroke
        }}
        contentEditableClassName="MarkDownEditorContent"
        className="dark-theme dark-editor"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin({}),
          tablePlugin(),
          markdownShortcutPlugin(),
          diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
          frontmatterPlugin(),
          imagePlugin(),
          quotePlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <div className="MarkDownToolBar" style={{ display: "flex" }}>
                <DiffSourceToggleWrapper>
                  <UndoRedo />
                  <Separator />
                  <BoldItalicUnderlineToggles />
                  <CodeToggle />
                  <Separator />
                  <ListsToggle />
                  <Separator />
                  <InsertFrontmatter />
                  <InsertImage />
                  <BlockTypeSelect />
                  <Separator />
                  <CreateLink />
                  <InsertTable />
                  <InsertThematicBreak />
                </DiffSourceToggleWrapper>
              </div>
            ),
          }),
        ]}
      />
    </Box>
  );
}

function Separator() {
  return (
    <div
      data-orientation="vertical"
      aria-orientation="vertical"
      role="separator"
    ></div>
  );
}
