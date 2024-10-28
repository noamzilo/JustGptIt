import React, { useState, useRef, useEffect } from 'react';

const GPTInterface = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: currentMessage }]);
    setCurrentMessage('');
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#343541' }}>
      {/* Simple Header */}
      <div className="flex items-center p-2 border-b border-gray-700" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <h1 className="text-lg font-normal text-white px-4">ChatGPT</h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center mt-20">
            <h1 className="text-2xl text-[#ECECEC] font-medium">How can I help you today?</h1>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              style={{ 
                backgroundColor: message.role === 'assistant' ? '#444654' : '#343541',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div className="max-w-3xl mx-auto p-6 text-[#ECECEC]">
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer with disclaimer and input */}
      <div className="px-2 py-2 text-xs text-center text-gray-400 mb-6">
        <p>ChatGPT can make mistakes. Consider checking important information.</p>
      </div>

      <div className="border-t border-gray-700 p-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Message ChatGPT..."
            className="w-full text-white rounded-xl pl-4 pr-10 py-3 focus:outline-none resize-none"
            style={{ 
              backgroundColor: '#40414f',
              minHeight: '24px',
              maxHeight: '200px'
            }}
            rows={1}
          />
          <button
            type="submit"
            className="absolute right-3 bottom-3 text-gray-400 hover:text-white"
            disabled={!currentMessage.trim()}
          >
            <span>➢</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GPTInterface;