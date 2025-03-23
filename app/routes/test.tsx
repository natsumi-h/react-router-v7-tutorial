import { useState } from "react";

export const gracefulDegradation = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)}></input>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <button onClick={() => console.log(email, password)}>Submit</button>
    </div>
  );
};

import { serverAction } from "~/actions/auth";

export const progressiveEnhancement = () => {
    
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      // Some Validation
    } catch (error) {
      e.preventDefault();
    }
  };

  return (
    <form action={serverAction} method="post" onSubmit={handleSubmit}>
      <input name="email" />
      <input name="password" />
      <button type="submit">Submit</button>
    </form>
  );
};
