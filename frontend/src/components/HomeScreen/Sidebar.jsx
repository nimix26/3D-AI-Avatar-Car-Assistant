import { FaUser, FaCar, FaMusic, FaMapMarkedAlt, FaTachometerAlt, FaThLarge, FaPowerOff } from 'react-icons/fa';

const Sidebar = () => {
  const icons = [
    <FaUser />,
    <FaCar />,
    <FaMusic />,
    <FaMapMarkedAlt />,
    <FaTachometerAlt />,
    <FaThLarge />,
    <FaPowerOff />
  ];

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-6 text-2xl text-pink-400">
      {icons.map((icon, i) => (
        <button key={i} className="hover:scale-110 transition-transform">
          {icon}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
