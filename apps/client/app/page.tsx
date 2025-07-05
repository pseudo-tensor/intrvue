import { AppBarWrapper } from "./_globalComponents/Appbar";

export default function Home() {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <h1>Landing</h1>
      <AppBarWrapper />
    </div>
  );
}
