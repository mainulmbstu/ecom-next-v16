import LoginForm from "./LoginForm";
import SocialLoginPage from "./social/SocialLogin";

export const metadata = {
  title: "Login",
  description: "Login page",
};

const Login = async () => {
  return (
    <div>
      <LoginForm>
        <SocialLoginPage />
      </LoginForm>
    </div>
  );
};

export default Login;
