"use client";

import { useEffect } from "react";

export default function IframeResizer() {
  useEffect(() => {
    const sendHeight = () => {
      window.parent.postMessage(
        { type: "iframeHeight", height: document.body.scrollHeight },
        "*"
      );
    };

    sendHeight();

    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  return null;
}
