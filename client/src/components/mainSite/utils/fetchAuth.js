const baseUrl = import.meta.env.VITE_API_BASE_URL;
let sessionExpired = false

export const fetchAuth = async(path, options = {}) => {
	const token = localStorage.getItem("sessionToken")
	const headers = {
		...options.headers,
		Authorization: `Bearer ${token}`,
		"Content-Type":"application/json"
	};
	try{
		const response = await fetch(`${baseUrl}${path}`,{
			...options,
			headers
		})

		//Handle unauthorized or expired token
		if((response.status === 401 || response.status === 403)&& !sessionExpired){
			sessionExpired = true
			alert('session expired, please log in again')
			localStorage.removeItem('sessionToken');
			window.location.href = "/sign-in"
			return;
		}
		return response

	}catch(err){
		console.log("Network error:", err)
		return null
	}
}//*/