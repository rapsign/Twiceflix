"use client";

import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";
import { TextLogo } from "../components/Logo";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { Separator } from "@/components/ui/separator";

const Login = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/admin");
    } catch (error) {
      toast.error(error.message || "Unable to sign in. Please try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-900">
      {/* Toast container */}
      <Toaster position="top-right" richColors />

      <div className="max-w-lg w-full p-6 rounded-md shadow-lg bg-neutral-800">
        <div className="flex justify-center items-center p-6">
          <TextLogo />
        </div>

        <Separator className="my-4 border-gray-600" />

        <p className="text-center text-white mb-4">
          Please sign in to access the admin panel.
        </p>

        <Button
          onClick={handleLogin}
          className="w-full bg-red-600 text-white hover:bg-red-700 mb-4 cursor-pointer"
        >
          Sign in with Google
        </Button>

        <p
          onClick={handleBack}
          className="text-center text-white cursor-pointer hover:underline hover:text-gray-300 cursor-pointer"
        >
          Back
        </p>
      </div>
    </div>
  );
};

export default Login;
