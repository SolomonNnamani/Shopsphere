
const baseUrl=  import.meta.env.VITE_API_BASE_URL;
let sessionExpired = false

export const fetchGoogleAuth = async(path, options = {}) => {
	const token = localStorage.getItem("onboardingToken")
	const headers = {
		...options.headers,
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json"
	};
	try{
		const response = await fetch(`${baseUrl}${path}`, {
			...options,
			headers
		})

		//Handle unauthorized or expired token
		if((response.status === 401 || response.status === 403) && !sessionExpired){
			sessionExpired = true
			alert('invalid token, please try registering again!')
			localStorage.removeItem('authToken');
			window.location.href = "/sign-up"
		}

		return response

	}catch(err){
		console.log("Network error:", err)
		return null
	}
}