import axios  from 'axios';

export const handleLogin = async (email: string, password: string): Promise<boolean> => {   
  console.log({email, password})
  const URL = `${import.meta.env.VITE_AUTH_ENDPOINT}/login`

  // call endpoint to initialize login and get back cookie
  // return true if successful login else false 
  try {
    const response = await axios.post(URL, {
      "Email": email,
      "Password": password
    })
    console.log(response)
    return true
  } catch (error: unknown) {
    console.log(`handleLogin catch error: ${error}`)
    return false
  }  
};

export const handleSignUp = async (email: string, password: string): Promise<boolean> => {
  console.log({email, password})
  const URL = `${import.meta.env.VITE_AUTH_ENDPOINT}/signup`

  // call endpoint to signup and store user details
  // return true if successful signup else false
  try {
    const response = await axios.post(URL, {
      "Email": email,
      "Password": password
    })
    console.log(response)
    return true
  } catch (error: unknown) {
    console.log(`handleSignUp catch error: ${error}`)
    return false
  }
 
}
