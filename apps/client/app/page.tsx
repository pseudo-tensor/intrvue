import { AppBarWrapper } from "./_globalComponents/Appbar";
import { Button } from '@repo/ui/Elements';

export default function Home() {
	
  return (
		<div>
			<div style={{display: 'flex', justifyContent: 'space-between'}}>
				<p className="">Landing</p>
				<AppBarWrapper />
			</div>
		</div>
  );
}
