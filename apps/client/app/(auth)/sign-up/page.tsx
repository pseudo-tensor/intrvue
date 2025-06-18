"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  return (
    <div>
      <br />
      <input placeholder='username' value={username} onChange={(e)=>{setUsername(e.target.value)}} />
      <br />
      <input placeholder='password' type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} />
      <br />
      <input placeholder='email' type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
      <br />
      <input placeholder='name' type="text" value={name} onChange={(e)=>{setName(e.target.value)}} />
      <br />
      <button
        onClick={async () => {
          const res = await signIn("sign-up-req", {
            username: username,
            password: password,
            name: name,
            email: email,
            redirect: false,
          });
          console.log(res);
          router.push("/");
        }}
      >
        Sign Up
      </button>
    </div>
  );
}
