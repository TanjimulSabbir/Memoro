import memoro from "../../assets/logo/transparent-text-black.png"

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
          <div className="text-2xl font-bold text-indigo-600">
              <img src={memoro} width={220} height={220} alt="memoro logo" />
      </div>

      {/* Navigation Links (optional) */}
      <ul className="flex space-x-6 text-gray-600 text-sm font-medium">
        <li className="hover:text-indigo-600 cursor-pointer">Home</li>
        <li className="hover:text-indigo-600 cursor-pointer">Features</li>
        <li className="hover:text-indigo-600 cursor-pointer">About</li>
        <li className="hover:text-indigo-600 cursor-pointer">Contact</li>
      </ul>
    </nav>
  );
}
