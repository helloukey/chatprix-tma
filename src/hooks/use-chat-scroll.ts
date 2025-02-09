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
    const { offsetHeight, scrollHeight, scrollTop } =
      ref.current as HTMLDivElement;
    if (scrollHeight <= scrollTop + offsetHeight + 100) {
      ref.current?.scrollTo(0, scrollHeight);
    }
  };

  useEffect(() => {
    Scroll();
  }, [messages]);

  return ref;
};

export { useChatScroll };
