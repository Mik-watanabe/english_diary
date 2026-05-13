import { Suspense } from "react";
import LoginForm from "../ui/login-form";

const loginPage = () => {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
};

export default loginPage;
