import { useState } from 'react';
import { sendMessage } from './MessageAPI';

const MessageForm = ({ studentId }) => {
  const [content, setContent] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageData = { receiverId: studentId, content };
    try {
      await sendMessage(messageData);
      setMessageSent(true);
      setContent('');
    } catch (error) {
      alert('Failed to send message');
    }
  };

  return (
    <div>
      <h3>Send a Message</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Send Message</button>
      </form>
      {messageSent && <p>Message sent successfully!</p>}
    </div>
  );
};

export default MessageForm;
