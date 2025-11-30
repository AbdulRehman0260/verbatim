import { useNavigate } from "react-router-dom";
import { authStore } from "../store/store";

const NavBar = () => {
  const { logout } = authStore();
  const navgate = useNavigate();
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Verbatim</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <button
              onClick={() => navgate("/post")}
              className="bg-base-100 rounded p-2 hover:bg-base-200"
            >
              Write Something
            </button>
          </li>
          <li>
            <button
              onClick={() => navgate("/profile")}
              className="bg-base-100 rounded p-2 hover:bg-base-200"
            >
              Profile
            </button>
          </li>
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
