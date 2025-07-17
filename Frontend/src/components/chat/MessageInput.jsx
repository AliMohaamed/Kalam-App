import { Paperclip, Smile, Send } from "lucide-react";

const MessageInput = ({ currentMessage, setCurrentMessage, handleSendMessage }) => (
  <form className="message-input-area" onSubmit={handleSendMessage}>
    <div className="input-container">
      <button
        type="button"
        className="attachment-btn"
        title="Attach File"
      >
        <Paperclip size={20} />
      </button>
      <input
        type="text"
        placeholder="Type a message..."
        className="message-input"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button type="button" className="emoji-btn" title="Add Emoji">
        <Smile size={20} />
      </button>
      <button type="submit" className="send-btn" title="Send Message">
        <Send size={20} />
      </button>
    </div>
  </form>
);

export default MessageInput; 