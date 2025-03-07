// LlmQueryService.js
import apiService from './apiService';

const LlmQueryService = {
	queryLLMService: async (query) => {
		if (!query) {
			return '';
		}
		try {
			console.log(`LlmQueryService asked ${query} and awaiting response`);
			const edited_query = "Use a maximum of 100 words to reply to: " + query;
			const response = await apiService.post('/llm/query', { "query": edited_query });
			if (response.status !== 200) {
				throw new Error(`Llm Query with query ${query} got error: ${response.data}`);
			}
			try {
				const llm_result = response.data.llm_response;
				console.log(`LlmQueryService asked ${query} and was answered ${llm_result}`);
				return llm_result;
			} catch (error) {
				console.error(`result from llm was not in the correct format or missing fields:`, error);
				throw error;
			}
		} catch (error) {
			console.error(`Llm Query with query ${query} got error: `, error);
			throw error;
		}
	}
};

export default LlmQueryService;
