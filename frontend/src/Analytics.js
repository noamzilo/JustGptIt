import ReactGA from "react-ga4";
import { GPT_PAGE_CONSTANTS } from "./components/gpt_page/constants";

export const initializeAnalytics = () => {
	ReactGA.initialize(GPT_PAGE_CONSTANTS.GOOGLE_ANALYTICS_MEASURMENT_ID); // Replace with your Measurement ID
};