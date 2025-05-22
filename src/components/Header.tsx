import { UserButton, useUser, SignInButton } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { Link, useLocation } from 'react-router-dom';
import './Css/header.css';

function Header() {
  const { user, isSignedIn } = useUser();
  const location = useLocation(); // Get current page path
  if(!user){
  console.log("user : ",user);
}

  
  return (
    <header className="">
      <div className="hoverUnderLine flex justify-between items-center shadow-sm py-2 px-5">
        <Link to="/">
          <img src="/OneCarLogo.png" width={70} className="mr-20" />
        </Link>
        <ul className="hidden md:flex gap-10">
          {[
            { name: "Home", path: "/" },
            { name: "Search", path: "/search" },
            { name: "Profile", path: "/profile" },
            { name: "New", path: "/new" },
            { name: "Preowned", path: "/preowned" },
          ].map((item) => (
            <li key={item.path} className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-blue-700">
              <a href={item.path} className={`relative ${location.pathname === item.path ? "active" : ""}`}>
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        {isSignedIn ? (
          <div className="flex items-center gap-5">
            <UserButton />
            <Link to="/profile">
              <Button className="hover:bg-blue-700 cursor-pointer">Submit Listing</Button>
            </Link>
          </div>
        ) : (
          
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
          
        )}
      </div>
    </header>
  );
}

export default Header;
