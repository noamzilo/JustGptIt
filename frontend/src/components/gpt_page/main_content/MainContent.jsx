// MainContent.jsx

import React, { useCallback, useState, useEffect } from 'react';
import styles from './MainContent.module.css';
import InitialChat from './chat/InitialChat';
import { GPT_PAGE_CONSTANTS } from '../constants';
import ResponseChat from './chat/ResponseChat';
import useLlmQuery from './chat/hooks/useLlmQuery';
import { useSearchParams } from 'react-router-dom';

const MainContent = () => {
  const [isInitialChatDoneAnimating, setIsInitialChatDoneAnimating] = useState(false);
  const [llmQuery, setLlmQuery] = useState('');
  const [llmResponse, setLlmResponse] = useState('');

  const queryLlm = useLlmQuery(setLlmResponse);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('query') || '';

  useEffect(() => {
    if (queryFromUrl) {
      console.log(`MainContent: Query from URL: ${queryFromUrl}`);
      queryLlm(queryFromUrl);
      setLlmQuery(queryFromUrl);
    }
  }, [queryFromUrl, queryLlm]);

  const onQueryChange = useCallback((query) => {
    console.log(`MainContent: Query changed to: ${query}`);
    setLlmQuery(query);
  }, []);

  const handleTypingAnimationDone = useCallback(() => {
    console.log('MainContent: Typing animation done');
    setIsInitialChatDoneAnimating(true);
    if (llmQuery.trim()) {
      queryLlm(llmQuery);
      searchParams.set('query', llmQuery);
      setSearchParams(searchParams);
    }
  }, [llmQuery, queryLlm, searchParams, setSearchParams]);

  const handleSendMessage = useCallback(
    (message) => {
      console.log(`MainContent: User sent message: ${message}`);
      setLlmQuery(message);
      queryLlm(message);
      searchParams.set('query', message);
      setSearchParams(searchParams);
    },
    [queryLlm, searchParams, setSearchParams]
  );

  return (
    <main className={styles.mainContent}>
      <header className={styles.header}>
        <h1>{GPT_PAGE_CONSTANTS.TITLE}</h1>
        <div className={styles.userIcon}>{GPT_PAGE_CONSTANTS.USER_ICON_TEXT}</div>
      </header>

      <section className={isInitialChatDoneAnimating ? styles.querySection : styles.centeredQuerySection}>
        {!isInitialChatDoneAnimating ? (
          <InitialChat
            initialQuery={llmQuery}
            onTypingAnimationDone={handleTypingAnimationDone}
            onLlmResponse={setLlmResponse}
            onQueryChange={onQueryChange}
          />
        ) : (
          <ResponseChat
            query={llmQuery}
            response={llmResponse}
            onSendMessage={handleSendMessage}
          />
        )}
      </section>

      <footer className={styles.disclaimer}>{GPT_PAGE_CONSTANTS.DISCLAIMER}</footer>
    </main>
  );
};

export default MainContent;
