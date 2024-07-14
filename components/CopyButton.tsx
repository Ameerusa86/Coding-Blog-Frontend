import React, { useState, useEffect, useRef } from "react";
import ClipboardJS from "clipboard";

interface CopyButtonProps {
  targetElement: React.RefObject<HTMLPreElement>; // Ref object for target code element
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  targetElement,
  textToCopy,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const clipboard = new ClipboardJS(targetElement.current!, {
      text: () => textToCopy,
    });

    clipboard.on("success", () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });

    clipboard.on("error", () => {
      setCopied(false);
    });

    return () => {
      clipboard.destroy();
    };
  }, [textToCopy]);

  return (
    <button className="copy-btn absolute top-2 right-2 bg-blue-500 text-white py-1 px-2 rounded text-sm">
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

export default CopyButton;
