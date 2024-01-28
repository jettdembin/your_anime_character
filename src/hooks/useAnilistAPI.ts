import { useQuery } from "@apollo/client";

export const useAnilistAPI = (query?: any, variables?: any) => {
	const { error, loading, data } = useQuery(query, {
		variables: variables || {},
	});
	//debugger;

	return { error, loading, data };
};
