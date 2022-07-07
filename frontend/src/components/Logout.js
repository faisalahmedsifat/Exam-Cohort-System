import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

// Redux
import { useDispatch } from 'react-redux';
import { logout } from '../features/currentUserSlice';

function Logout() {
  const dispatch = useDispatch()
  let navigate = useNavigate();

  useEffect(() => {
    window.localStorage.removeItem('currentUser')
    dispatch(logout())
    navigate("/", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      Logging you out, please wait...
    </div>
  )
}

export default Logout