
const baseUrl = import.meta.env.VITE_API_BASE_URL;
let sessionExpired = false
export const fetchWithAuth = async(path, options = {}) => {
	const token = localStorage.getItem("authToken")
	const headers = {
		...options.headers,
		Authorization: `Bearer ${token}`,
		"Content-Type":"application/json"
	};
	try{
		const response = await fetch(`${baseUrl}${path}`,{
			...options,
			 headers
			});

		//Handle unauthorized or expired token
		if((response.status === 401 || response.status === 403) && !sessionExpired){
			sessionExpired = true
			alert('Session timed out. please log in again!')
			
			
						localStorage.removeItem('authToken');
						window.location.href = "/dashboard/dashboard-login";
			
			
			return null;
		}
		return response
	}catch(err){
		//console.log("Network error:", err)
		return null
	}



}