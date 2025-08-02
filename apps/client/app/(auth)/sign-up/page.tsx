"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AppBarWrapper } from "../../_globalComponents/Appbar";
import { Button } from "@repo/ui/Elements";

export default function SignUpPage() {
  const displayErrorMsg = () => {
    if (username.length == 0) setUError(true);
    if (password.length == 0) setPError(true);
    if (name.length == 0) setNError(true);
    if (email.length == 0) setEError(true);
  }
  const [uError, setUError] = useState(false);
  const [pError, setPError] = useState(false);
  const [nError, setNError] = useState(false);
  const [eError, setEError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();

  const signUpHandler = async () => {
    if (username.length == 0 || password.length == 0 || name.length == 0 || email.length == 0) {
      displayErrorMsg();
      return;
    }
    setButtonLoading(true);
    await signIn("sign-up-req", {
      username: username,
      password: password,
      name: name,
      email: email,
      redirect: false,
    });
    router.push("/");
    setButtonLoading(false);
  }

  useEffect(() => {
    const clickHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("actualButton")?.click();
      }
    }
    window.addEventListener("keypress", clickHandler); 

    return () => {
      window.removeEventListener("keypress", clickHandler);
    };
  });

  return (
    <div>
      <AppBarWrapper />
      <div id="pageroot"
        style={{ width: '100vw', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}
        className='h-[calc(100svh-8rem)]'
      >
        <div
          className='w-3/5 p-12 h-40vh w-40vw grid'
        >
          <p className='mb-20 text-5xl font-thin text-center font'> Intrvue </p>
          <input
            placeholder='username' value={username}
            onChange={(e)=>{
              if (e.target.value.length == 0) setUError(true);
              else setUError(false);
              setUsername(e.target.value);
            }}
            className='px-2 py-4 text-3xl text-center border bg-gunmetal'
          />
          <p className={`text-2xl text-red-400 transition-opacity duration-300 ease-in ${uError ? 'opacity-100' : 'opacity-0'}`}>
            *Enter a valid username
          </p>
          <span className='h-2'></span>
          <input
            placeholder='password' type="password" value={password} 
            onChange={(e)=>{
              if (e.target.value.length == 0) setPError(true);
              else setPError(false);
              setPassword(e.target.value);
            }}
            className='px-2 py-4 text-3xl text-center border bg-gunmetal'
          />
          <p className={`text-2xl text-red-400 transition-opacity duration-300 ease-in ${pError ? 'opacity-100' : 'opacity-0'}`}>
            *Enter a valid password
          </p>
          <span className='h-2'></span>
          <input
            placeholder='email' value={email}
            onChange={(e)=>{
              if (e.target.value.length == 0) setEError(true);
              else setEError(false);
              setEmail(e.target.value);
            }}
            className='px-2 py-4 text-3xl text-center border bg-gunmetal'
          />
          <p className={`text-2xl text-red-400 transition-opacity duration-300 ease-in ${eError ? 'opacity-100' : 'opacity-0'}`}>
            *Enter a valid email address
          </p>
          <span className='h-2'></span>
          <input
            placeholder='name' value={name}
            onChange={(e)=>{
              if (e.target.value.length == 0) setNError(true);
              else setNError(false);
              setName(e.target.value);
            }}
            className='px-2 py-4 text-3xl text-center border bg-gunmetal'
          />
          <p className={`text-2xl text-red-400 transition-opacity duration-300 ease-in ${nError ? 'opacity-100' : 'opacity-0'}`}>
            *Enter a valid name
          </p>
          <span className='h-2'></span>
          <Button
            loading={buttonLoading}
            id='SignUpButton'
            buttonid='actualButton'
            text='Sign Up'
            handler={signUpHandler}
          />
        </div>
        <img style={{objectFit: 'cover', width: '100%', height: '100vh'}} src='image.webp'/>
      </div>
    </div>
  );
}
