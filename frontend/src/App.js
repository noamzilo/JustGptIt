import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GPTInterface from './components/gpt_page/GPTInterface';
import debugEnvironment from './utils/envDebug';
import { initializeAnalytics } from "./Analytics";
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { useEffect } from 'react';

// Run environment debug on app start
const envVars = debugEnvironment();
console.debug(`envVars: ${envVars}`);

const TrackPageView = () => {
	const location = useLocation();

	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: location.pathname });
	}, [location]);

	return null;
};

function App() {
	useEffect(() => {
		initializeAnalytics();
	}, []);

	return (
		<Router >
			<TrackPageView />
			<Routes>
				<Route path="/*" element={<GPTInterface />} />
			</Routes>
		</Router>
	);
}

export default App;
