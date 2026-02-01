import React from 'react'
import LoginForm from './LoginForm'

export const metadata = {
  title: "Login",
  description: "Login page",
};


const Login =async () => {

  return (
      <div>
          <LoginForm/>
      </div>
  )
}

export default Login