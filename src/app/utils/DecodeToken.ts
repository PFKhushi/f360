import { jwtDecode } from "jwt-decode";
import { TokenPayloadType } from "../types/TokenPayloadType";

export function DecodeToken(token: string){
  
  return jwtDecode<TokenPayloadType>(token)
  
}