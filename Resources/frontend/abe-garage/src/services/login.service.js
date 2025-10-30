const api_url = process.env.REACT_APP_API_URL;

// A function to send the login request to the server 
const logIn = async (formData) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  };
  
  try {
    const response = await fetch(`${api_url}/api/employees/login`, requestOptions);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Server returned HTML instead of JSON. Response: ${text.substring(0, 100)}...`);
    }
    
    return response;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
}

// A function to log out the user
const logOut = () => {
  localStorage.removeItem("employee");
};

// ✅ FIX: Use default export instead of named exports
const loginService = {
  logIn,
  logOut
};

export default loginService;