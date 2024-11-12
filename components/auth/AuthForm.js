"use client";

import { useState } from "react";
import { useFirebaseAuth } from "../../services/useFirebaseAuth";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, logIn, error } = useFirebaseAuth();

  return (
    <div>
      <h2>Authentication</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => signUp(email, password)}>Sign Up</button>
      <button onClick={() => logIn(email, password)}>Log In</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AuthForm;
