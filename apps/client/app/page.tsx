import { AppBarWrapper } from "./_globalComponents/Appbar";
import { Button } from '@repo/ui/Elements';

export default function Home() {

  return (
    <div>
      <AppBarWrapper />
      <div className='h-[calc(100svh-4rem)]'>
        <img style={{objectFit: 'cover', width: '100%', height: '100%'}} src='image.webp'/>
      </div>
    </div>
  );
}
