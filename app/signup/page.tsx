import React, { Suspense } from "react";
import SignUpForm from "../ui/signup-form";

const SignupPage = () => {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
};

export default SignupPage;
