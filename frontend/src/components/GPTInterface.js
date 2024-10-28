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

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: currentMessage }]);
    
    // Clear input
    setCurrentMessage('');
  };

  return (
    <div className="gpt-interface" style={{height: '100vh', backgroundColor: '#343541', color: '#ECECEC'}}>
      {/* Welcome Message when no messages */}
      {messages.length === 0 && (
        <div className="justify-center flex h-full flex-shrink flex-col items-center overflow-hidden text-[#ECECEC]">
          <div className="relative inline-flex justify-center text-center text-2xl font-semibold leading-9">
            <h1>What can I help with?</h1>
          </div>
          <div className="h-[116px]">
            <div className="mt-5 flex items-center justify-center gap-x-2 transition-opacity xl:gap-x-2.5 opacity-100 flex-wrap">
              <ul className="relative flex items-stretch gap-x-2 gap-y-4 overflow-hidden py-2 sm:gap-y-2 xl:gap-x-2.5 xl:gap-y-2.5 flex-wrap justify-center">
                {/* Quick Action Buttons */}
                {[
                  { icon: "📝", text: "Write & edit", color: "#35AE47" },
                  { icon: "💡", text: "Brainstorm ideas", color: "#E2C541" },
                  { icon: "📊", text: "Analyze data", color: "#76D0EB" },
                  { icon: "❓", text: "Answer questions", color: "#EA8444" }
                ].map((action, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => setCurrentMessage(action.text)}
                      className="relative flex h-[42px] items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.1)] px-3 py-2 text-start text-[13px] hover:bg-[#40414f] transition-colors"
                      style={{backgroundColor: 'rgba(68,70,84,0.1)'}}
                    >
                      <span style={{color: action.color}}>{action.icon}</span>
                      <span className="text-[#B4B4B4]">{action.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`border-b border-[rgba(255,255,255,0.1)] ${
              message.role === 'assistant' ? 'bg-[#444654]' : 'bg-[#343541]'
            }`}
          >
            <div className="max-w-3xl mx-auto flex p-4 text-base text-[#ECECEC] gap-4">
              <div className={`w-7 h-7 rounded-sm flex items-center justify-center ${
                message.role === 'assistant' 
                  ? 'bg-[#19c37d]' 
                  : 'bg-[#343541] border border-[rgba(255,255,255,0.1)]'
              }`}>
                {message.role === 'assistant' ? '🤖' : '👤'}
              </div>
              <div className="min-h-[20px] whitespace-pre-wrap flex-1">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="border-b border-[rgba(255,255,255,0.1)] bg-[#444654]">
            <div className="max-w-3xl mx-auto flex p-4 gap-4">
              <div className="w-7 h-7 rounded-sm bg-[#19c37d] flex items-center justify-center">
                🤖
              </div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-[rgba(255,255,255,0.1)] p-4 bg-[#343541]">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
          <div className="relative">
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
              className="w-full bg-[#40414f] text-[#ECECEC] rounded-lg pl-4 pr-12 py-3 focus:outline-none resize-none border border-[rgba(255,255,255,0.1)]"
              style={{maxHeight: '200px'}}
              placeholder="Message ChatGPT..."
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