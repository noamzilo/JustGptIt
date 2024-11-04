import apiService from './apiService';

const LlmQueryService = {
    queryLLMService: async (query) => {
        try {
            console.log(`LlmQueryService asked ${query} and awaiting response`)
            const response = await apiService.post('/llm', { "query": query });
            console.log(`LlmQueryService asked ${query} and was answered ${response}`)
            return response.status === 'valid';
        } catch (error) {
            console.error(`Llm Query with query ${query} got error: `, error);
            return false;
        }
    }
};

export default LlmQueryService;