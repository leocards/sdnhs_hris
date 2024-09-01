import React, { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import {
    EditorState,
    LexicalEditor,
    KEY_ENTER_COMMAND,
    COMMAND_PRIORITY_HIGH,
    CLEAR_EDITOR_COMMAND,
} from "lexical";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

const theme = {
    // Define any custom theme styling here
};

const initialConfig = {
    namespace: "MessageInput",
    theme,
    onError: (error: Error) => {
        console.error(error);
    },
};

function TextContentListener({ onChange }: { onChange: CallableFunction }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerTextContentListener((text) => {
            onChange(text);
        });
    }, [editor]);

    return null;
}

const EnterCommand = ({ onSubmit = () => {} }) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            KEY_ENTER_COMMAND,
            (event: KeyboardEvent) => {
                const { shiftKey, key } = event;

                if (key == "Enter" && shiftKey == false) {
                    event.preventDefault();

                    onSubmit();

                    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
                }

                return true;
            },
            COMMAND_PRIORITY_HIGH
        );
    }, [editor, onSubmit]);

    return null;
};

const ErrorBoundary: React.FC<{ error: Error }> = ({ error }) => {
    return <div className="error">Something went wrong: {error.message}</div>;
};

const MessageBoxInput: React.FC = () => {
    const editorRef = React.useRef<LexicalEditor | null>(null);
    const [message, setMessage] = useState("");

    const onChange = (editorState: EditorState, editor: LexicalEditor) => {
        editorState.read(() => {
            editorRef.current = editor;
        });
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="w-full relative self-end border rounded-md overflow-hidden">
                <PlainTextPlugin
                    contentEditable={
                        <ContentEditable className="px-2 my-2 ring-inset relative outline-none max-h-28 overflow-y-auto rounded-scrollbar" />
                    }
                    placeholder={
                        <div className="placeholder absolute top-1/2 -translate-y-1/2 left-2 pointer-events-none opacity-60">
                            Aa
                        </div>
                    }
                    ErrorBoundary={(props) => (
                        <ReactErrorBoundary
                            FallbackComponent={ErrorBoundary}
                            {...props}
                        />
                    )}
                />
                <OnChangePlugin onChange={onChange} />
                <EnterCommand onSubmit={() => console.log(message)} />
                <TextContentListener
                    onChange={(text: string) => {
                        if (text.trim() != "") setMessage(text);
                        else setMessage(text.trim());
                    }}
                />
                <ClearEditorPlugin />
                <HistoryPlugin />
            </div>
        </LexicalComposer>
    );
};

export default MessageBoxInput;
