import { toast, ToastOptions } from "react-toastify";

export class MessageService {

  private _toastOptions: ToastOptions = {
    position: "top-right",
    draggable: false,
    closeButton: false,
    // autoClose: 3000,
    // className: 'toast-index',
    // hideProgressBar: false,
    // closeOnClick: true,
    // pauseOnHover: true,
    
    // progress: undefined,
    // style: { zIndex: 999999999 }
  }

  constructor(){}

  public info(message: string){
    return toast.info(message, this._toastOptions)
  }

  public success(message: string){
    return toast.success(message, this._toastOptions)
  }

  public warning(message: string){
    return toast.warning(message, this._toastOptions)
  }

  public error(message: string){
    return toast.error(message, this._toastOptions)
  }

  public default(message: string){
    return toast(message, this._toastOptions)
  }
}