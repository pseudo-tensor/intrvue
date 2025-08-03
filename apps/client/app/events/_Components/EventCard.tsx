import { Button } from "@repo/ui/Elements";
import { useState } from "react";
import { sessionDataTsType } from "@repo/types/userTypes";

/* TODO: Once status is working, disable button according to that */
export default function EventCard(
  { type, sessionData, router }:{type: string, sessionData: sessionDataTsType, router: any }
)

{
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showID, setShowID] = useState(false);
  const buttonHandler = () => {
    setButtonLoading(true);
    router.push(`/interview/${sessionData.session_id}`)
    setButtonLoading(false);
  }

  return (
    <div className='flex justify-center p-6'>
      <div className='w-128'>
        <span className='flex text-2xl'> 
          <p className='mr-5 text-periwinkle'> Date: </p>
          { new Date(sessionData.date!).toLocaleDateString('en-GB') } 
        </span>
        {
          type == 'host' 
            ? (<span className='flex text-2xl'> 
              <p className='mr-5 text-periwinkle'> Participant: </p> 
              {sessionData.participant? sessionData.participant.username : "NONE"} 
            </span>)
            : (<span className='flex text-2xl'> 
              <p className='mr-5 text-periwinkle'> Host: </p> 
              {sessionData.host? sessionData.host.username : "NONE"} 
            </span>)
        }
        <p className='text-2xl cursor-pointer text-periwinkle' onClick={()=>{setShowID(!showID)}}> {!showID? "Show ID" : sessionData.session_id} </p>
      </div>
      <div className='w-40 h-20 ml-20'>
        <Button buttonid={sessionData.session_id } text="Join" handler={buttonHandler} />
      </div>
    </div>
  );
}
