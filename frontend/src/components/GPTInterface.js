import React, { useState, useRef, useEffect } from 'react';

const GPTInterface = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currentMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    setIsLoading(true);
    const userMessage = currentMessage;
    setCurrentMessage('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/gpt/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const AssistantIcon = () => (
    <div className="w-7 h-7 rounded-sm bg-[#19c37d] flex items-center justify-center">
      <svg width="24" height="24" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
        <path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707Z" fill="currentColor" />
      </svg>
    </div>
  );

  const UserIcon = () => (
    <div className="w-7 h-7 rounded-sm bg-[#343541] border border-[#565869] flex items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
        <path d="M16 4C10.477 4 6 8.477 6 14C6 19.523 10.477 24 16 24C21.523 24 26 19.523 26 14C26 8.477 21.523 4 16 4Z" fill="currentColor"/>
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#343541]">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-[#343541]">
        <div className="flex items-center space-x-2">
          <h1 className="text-white text-xl font-semibold">ChatGPT 4.0</h1>
        </div>
        <button className="text-gray-400 hover:text-white p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`border-b border-gray-700 ${message.role === 'assistant' ? 'bg-[#444654]' : 'bg-[#343541]'}`}>
            <div className="max-w-3xl mx-auto flex space-x-6 p-4 text-base text-gray-100">
              {message.role === 'assistant' ? <AssistantIcon /> : <UserIcon />}
              <div className="min-h-[20px] whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="border-b border-gray-700 bg-[#444654]">
            <div className="max-w-3xl mx-auto flex space-x-6 p-4">
              <AssistantIcon />
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-700 p-4 bg-[#343541]">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
              className="w-full bg-[#40414f] text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              placeholder="Message ChatGPT..."
              style={{ maxHeight: '200px' }}
            />
            <button
              type="submit"
              disabled={isLoading || !currentMessage.trim()}
              className="absolute right-3 bottom-2.5 text-gray-400 hover:text-white disabled:hover:text-gray-400 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GPTInterface;