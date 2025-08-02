"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from '@repo/ui/Elements';
import { AppBarWrapper } from "../../_globalComponents/Appbar";

export default function SignInPage() {
  const displayErrorMsg = () => {
    if (username.length == 0) setUError(true);
    if (password.length == 0) setPError(true);
  }
  const [uError, setUError] = useState(false);
  const [pError, setPError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const router = useRouter();

  const signInHandler = async () => {
    if (username.length == 0 || password.length == 0) {
      displayErrorMsg();
      return;
    }
    setButtonLoading(true);
    await signIn("sign-in-req", {
      username: username,
      password: password,
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
          <Button
            loading={buttonLoading}
            id='SignInButton'
            buttonid='actualButton'
            text='Sign In'
            handler={signInHandler}
          />
        </div>
        <img style={{objectFit: 'cover', width: '100%', height: '100vh'}} src='image.webp'/>
      </div>
    </div>
  );
}
