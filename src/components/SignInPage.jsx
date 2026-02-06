import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <SignIn appearance={{ elements: { footerAction: "hidden" } }} />
    </div>
  );
}
