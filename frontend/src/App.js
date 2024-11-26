import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GPTInterface from './components/gpt_page/GPTInterface';
import debugEnvironment from './utils/envDebug';

// Run environment debug on app start
const envVars = debugEnvironment();
console.debug(`envVars: ${envVars}`);

function App() {
	return (
		<Router >
			<Routes>
				<Route path="/*" element={<GPTInterface />} />
			</Routes>
		</Router>
	);
}

export default App;
