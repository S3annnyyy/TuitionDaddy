import axios  from 'axios';

export const handleLogin = async (email: string, password: string): Promise<boolean> => {   
  console.log({email, password})
  const URL = `${import.meta.env.VITE_USER_ENDPOINT}/login`

  // call endpoint to initialize login and get back cookie
  // return true if successful login else false 
  try {
    const response = await axios.post(URL, {
      "Email": email,
      "Password": password
    })
    console.log(response)

    // store username in sessionstorage
    sessionStorage.setItem("username", response.data.username)
    sessionStorage.setItem("token", response.data.token)
    sessionStorage.setItem("userid", response.data.userID)   
    const token = response.data.token;

    // Set cookie expiration date (optional)
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // Cookie will expire in 30 days

    // Construct cookie string
    const cookieString = `Authorization=${token}; expires=${expires.toUTCString()}; path=/`;

    // Set the cookie
    document.cookie = cookieString; 
    return true
  } catch (error: unknown) {
    console.log(`handleLogin catch error: ${error}`)
    return false
  }  
};

export const handleSignUp = async (email: string, password: string, fullname: string, organisation: string, educationLevel: string, role: string, transcript: File | undefined): Promise<boolean> => {
  console.log({email, password, fullname, organisation, educationLevel, role, transcript})

  const URL = `${import.meta.env.VITE_USER_ENDPOINT}/signup`
  const formData = new FormData();
  formData.append("Email", email);
  formData.append("Password", password);
  formData.append("Username", fullname);
  formData.append("Organisation", organisation);
  formData.append("Role", role);
  formData.append("EducationLevel", educationLevel);
  if (transcript) {formData.append("Transcript", transcript);}    
  

  // call endpoint to signup and store user details
  // return true if successful signup else false
  try {
    const response = await axios.post(URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log(response)
    return true
  } catch (error: unknown) {
    console.log(`handleSignUp catch error: ${error}`)
    return false
  } 
}
