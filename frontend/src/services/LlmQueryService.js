import apiService from './apiService';

const LlmQueryService = {
    queryLLMService: async (payload) => {
        try {
            console.log(`LlmQueryService asked ${payload} and awaiting response`)
            const response = await apiService.post('/llm/query', { "message": payload });
            console.log(`LlmQueryService asked ${payload} and was answered ${response}`)
            return response.status === 'valid';
        } catch (error) {
            console.error(`Llm Query with payload ${payload} got error: `, error);
            return false;
        }
    }
};

export default LlmQueryService;