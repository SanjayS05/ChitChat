import { useRef, useState } from "react";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    
    return (
    <div>
      Message input
    </div>
  )
}

export default MessageInput
