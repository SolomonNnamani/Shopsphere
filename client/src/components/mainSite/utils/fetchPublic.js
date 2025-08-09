const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchPublic = async(path,options = {}) => {
	try{
		const response = await fetch(`${baseUrl}${path}`, {
			...options,
			headers:{
				"Content-Type": "application/json",
				...options.headers
			},
		});
		if(!response.ok){
			console.error('Bad response:', response.status)
			return null;
		}

		return response
	}catch(err){
		console.error('Public fetch error:', err);
		return null
	}
}