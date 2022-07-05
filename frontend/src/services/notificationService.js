// Toastify
import { toast } from 'react-toastify';

// Toast Setup
const defaultSettings = {
  position: "bottom-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined
}

const success = (message, time) => toast.success(message, { ...defaultSettings, autoClose: time });
const error = (message, time) => toast.error(message, { ...defaultSettings, autoClose: time });
const info =  (message, time) => toast.info(message, { ...defaultSettings, autoClose: time });
const warn = (message, time) => toast.warn(message, { ...defaultSettings, autoClose: time });

const exports = { success, error, info, warn }
export default exports