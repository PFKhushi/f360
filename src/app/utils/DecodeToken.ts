import { jwtDecode } from "jwt-decode";
import { TokenPayloadType } from "../types/TokenPayloadType";

export function DecodeToken(token: string){

  try {
    const tokenDecoded = jwtDecode<TokenPayloadType>(token)
    return tokenDecoded
  } catch {
    return null
  }

}