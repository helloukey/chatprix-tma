import { useEffect, useRef } from "react";

interface Message {
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  text: string;
  sender: string;
}

const useChatScroll = ({ messages }: { messages: Message[] }) => {
  const ref = useRef<HTMLDivElement>(null);

  const Scroll = () => {
    if (ref.current?.children.length) {
      const lastElement = ref.current?.lastChild as HTMLElement;

      lastElement?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    Scroll();
  }, [messages]);

  return ref;
};

export { useChatScroll };
