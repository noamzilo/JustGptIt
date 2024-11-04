import apiService from './apiService';

const LlmQueryService = {
    queryGPT: async (payload) => {
        try {
            const response = await apiService.post('/gpt/query', { "message": payload });
            console.log(`GPTQueryService asked ${payload} and was answered ${response}`)
            return response.status === 'valid';
        } catch (error) {
            console.error(`Gpt Query with payload ${payload}:`, error);
            return false;
        }
    }
};

export default LlmQueryService;