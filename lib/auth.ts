import {cookies} from "next/headers";
import {SignJWT,jwtVerify} from "jose";
import {sql,setup} from "./db";
export type User={id:string;name:string;role:"ADMIN"|"SALES"};
function key(){const s=process.env.AUTH_SECRET;if(!s||s.length<32)throw Error("AUTH_SECRET minimal 32 karakter");return new TextEncoder().encode(s);}
export async function login(u:User){const token=await new SignJWT({role:u.role}).setProtectedHeader({alg:"HS256"}).setSubject(u.id).setExpirationTime("7d").sign(key());(await cookies()).set("crm_session",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:604800});}
export async function user():Promise<User|null>{try{const token=(await cookies()).get("crm_session")?.value;if(!token)return null;const {payload}=await jwtVerify(token,key());await setup();const r=await sql()`SELECT id,name,role FROM users WHERE id=${payload.sub!}`;return r.length?{id:r[0].id,name:r[0].name,role:r[0].role}:null;}catch{return null;}}
export async function logout(){(await cookies()).delete("crm_session");}
