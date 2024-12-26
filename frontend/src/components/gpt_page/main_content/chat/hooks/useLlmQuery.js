// useLlmQuery.js

import { useCallback } from 'react';
import LlmQueryService from '../../../../../services/LlmQueryService';

function useLlmQuery(onLlmResponse) {
	const queryLlm = useCallback(
		async (decodedQuery) => {
			try {
				console.log(`LlmQueryService asked ${decodedQuery} and awaiting response`);
				const response = await LlmQueryService.queryLLMService(decodedQuery);
				await new Promise((resolve) => setTimeout(resolve, 500));
				console.log('Response from LLM:', response);
				onLlmResponse(response);
			} catch (error) {
				console.error('Error communicating with LLM:', error);
			}
		},
		[onLlmResponse]
	);

	return queryLlm;
}

export default useLlmQuery;
