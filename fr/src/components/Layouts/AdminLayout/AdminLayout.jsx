import { Outlet } from "react-router-dom";
import useLocalStorageRoute from "../../../utils/useLocalStorageRoute";

export const AdminLayout = () => {
  
  useLocalStorageRoute()

  // const location = useLocation();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const savedRoute = localStorage.getItem("currentRoute");
  //   if (savedRoute && savedRoute !== location.pathname) {
  //     navigate(savedRoute);
  //   }
  // }, [location, navigate]);

  return (
    <>
      <Outlet />
    </>
  );
};