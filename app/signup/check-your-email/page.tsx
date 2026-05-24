import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const CheckYourEmailPage = () => {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <Card className="mt-4 shadow-2xs sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent>
            <p>We&apos;ve sent you a confirmation email.</p>
            <p>
              Please check your email and click the link to confirm your
              account.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckYourEmailPage;
