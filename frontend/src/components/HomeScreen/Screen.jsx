import Sidebar from './Sidebar';
import Avatar from './Avatar';

function Screen() {
  return (
    <div className="h-screen w-full bg-[#28282B] text-white relative overflow-hidden rounded-xl">
      <Sidebar />
      <Avatar />
    </div>
  );
}

export default Screen;
