import { useEffect } from "react";

interface MetaProps {
  title?: string;
  description?: string;
}

export default function useMeta({ title, description }: MetaProps) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let tag = document.querySelector("meta[name='description']");
      
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", description);
    }
  }, [title, description]);
}