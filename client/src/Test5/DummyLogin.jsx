import React from "react";
const googleClientId =
  "395250753516-f1ldelpv40dsmkp5gqci5td9m7m27c8h.apps.googleusercontent.com";
const DummyLogin = () => {
  const handleClick = () => {
    const callbackUrl = `http://localhost:8000/auth/google/callback`;
    const scopes = "openid email profile";
    const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=token&client_id=${googleClientId}&scope=${encodeURIComponent(
      scopes
    )}`;
    window.location.href = targetUrl;
  };

  return (
    <div className="flex p-2">
      <div
        className="p-1 shadow-md border hover:bg-gray-100 cursor-pointer"
        onClick={handleClick}
      >
        Google login
      </div>
    </div>
  );
};

export default DummyLogin;
