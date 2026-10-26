"use server";
import {redirect} from "next/navigation";
import bcrypt from "bcryptjs";
import {sql,setup} from "@/lib/db";
import {user,login,logout} from "@/lib/auth";
import {statuses} from "@/lib/constants";
const val=(f:FormData,k:string,max=3000)=>String(f.get(k)||"").trim().slice(0,max);
export async function signIn(f:FormData){
 await setup();const email=val(f,"email",200).toLowerCase(),password=val(f,"password",200);
 const rows=await sql()`SELECT * FROM users WHERE email=${email}`;
 if(!rows.length||!(await bcrypt.compare(password,rows[0].password)))redirect("/login?error=1");
 await login({id:rows[0].id,name:rows[0].name,role:rows[0].role});redirect("/dashboard");
}
export async function signOut(){await logout();redirect("/login");}
export async function saveLead(f:FormData){
 const u=await user();if(!u)redirect("/login");
 const id=val(f,"id",36),name=val(f,"name",150),company=val(f,"company",150),phone=val(f,"phone",50),product=val(f,"product",200),notes=val(f,"notes",5000);
 const status=val(f,"status",30),amount=Number(val(f,"value",30)||0),date=val(f,"followup",10)||null;
 if(!name||!statuses.includes(status)||!Number.isFinite(amount)||amount<0||amount>99999999999999)throw Error("Data lead tidak valid");
 if(date&&!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error("Tanggal tidak valid");
 const db=sql();const requested=val(f,"owner",36);const owner=u.role==="ADMIN"&&requested?requested:u.id;
 if(!/^[0-9a-f-]{36}$/i.test(owner))throw Error("PIC tidak valid");
 if(!(await db`SELECT id FROM users WHERE id=${owner}`).length)throw Error("PIC tidak ditemukan");
 let target=id;
 if(id){
  if(!/^[0-9a-f-]{36}$/i.test(id))throw Error("ID tidak valid");
  const r=await db`UPDATE leads SET name=${name},company=${company},phone=${phone},product=${product},notes=${notes},status=${status},value=${amount},followup=${date},owner=${owner} WHERE id=${id} AND (${u.role==="ADMIN"} OR owner=${u.id}) RETURNING id`;
  if(!r.length)throw Error("Akses ditolak");target=r[0].id;
 }else{
  const r=await db`INSERT INTO leads(name,company,phone,product,notes,status,value,followup,owner) VALUES(${name},${company},${phone},${product},${notes},${status},${amount},${date},${owner}) RETURNING id`;target=r[0].id;
 }
 redirect("/leads/"+target);
}
export async function addNote(f:FormData){
 const u=await user();if(!u)redirect("/login");const id=val(f,"id",36),note=val(f,"note",3000);
 if(!note||!/^[0-9a-f-]{36}$/i.test(id))throw Error("Catatan tidak valid");
 const db=sql();const r=await db`SELECT id FROM leads WHERE id=${id} AND (${u.role==="ADMIN"} OR owner=${u.id})`;if(!r.length)throw Error("Akses ditolak");
 await db`INSERT INTO activities(lead,actor,note) VALUES(${id},${u.id},${note})`;redirect("/leads/"+id);
}
export async function addSales(f:FormData){
 const u=await user();if(!u)redirect("/login");if(u.role!=="ADMIN")throw Error("Akses ditolak");
 const name=val(f,"name",100),email=val(f,"email",200).toLowerCase(),password=val(f,"password",200);
 if(!name||!/^\S+@\S+\.\S+$/.test(email)||password.length<12)throw Error("Nama/email/password tidak valid");
 await sql()`INSERT INTO users(name,email,password,role) VALUES(${name},${email},${await bcrypt.hash(password,12)},'SALES')`;redirect("/team");
}

export async function deleteLead(f:FormData){
 const u=await user();if(!u)redirect("/login");const id=val(f,"id",36);
 if(!/^[0-9a-f-]{36}$/i.test(id))throw Error("ID tidak valid");
 const r=await sql()`DELETE FROM leads WHERE id=${id} AND (${u.role==="ADMIN"} OR owner=${u.id}) RETURNING id`;
 if(!r.length)throw Error("Lead tidak ditemukan atau akses ditolak");
 redirect("/leads");
}
export async function saveCustomer(f:FormData){
 const u=await user();if(!u)redirect("/login");
 const id=val(f,"id",36),name=val(f,"name",150),company=val(f,"company",150),phone=val(f,"phone",50),email=val(f,"email",200),address=val(f,"address",1000),notes=val(f,"notes",5000);
 if(!name)throw Error("Nama customer wajib diisi");
 if(email&&!/^\S+@\S+\.\S+$/.test(email))throw Error("Email tidak valid");
 await setup();const db=sql();const requested=val(f,"owner",36);const owner=u.role==="ADMIN"&&requested?requested:u.id;
 if(!/^[0-9a-f-]{36}$/i.test(owner)||!(await db`SELECT id FROM users WHERE id=${owner}`).length)throw Error("PIC tidak valid");
 let target=id;
 if(id){
  if(!/^[0-9a-f-]{36}$/i.test(id))throw Error("ID tidak valid");
  const r=await db`UPDATE customers SET name=${name},company=${company},phone=${phone},email=${email},address=${address},notes=${notes},owner=${owner} WHERE id=${id} AND (${u.role==="ADMIN"} OR owner=${u.id}) RETURNING id`;
  if(!r.length)throw Error("Customer tidak ditemukan atau akses ditolak");target=r[0].id;
 }else{
  const r=await db`INSERT INTO customers(name,company,phone,email,address,notes,owner) VALUES(${name},${company},${phone},${email},${address},${notes},${owner}) RETURNING id`;target=r[0].id;
 }
 redirect("/customers/"+target);
}
export async function deleteCustomer(f:FormData){
 const u=await user();if(!u)redirect("/login");const id=val(f,"id",36);
 if(!/^[0-9a-f-]{36}$/i.test(id))throw Error("ID tidak valid");
 await setup();const r=await sql()`DELETE FROM customers WHERE id=${id} AND (${u.role==="ADMIN"} OR owner=${u.id}) RETURNING id`;
 if(!r.length)throw Error("Customer tidak ditemukan atau akses ditolak");
 redirect("/customers");
}

export async function saveCashflow(f:FormData){
 const u=await user();if(!u)redirect("/login");await setup();
 const id=val(f,"id",36),title=val(f,"title",150),month=val(f,"month",7),confidence=val(f,"confidence",20),notes=val(f,"notes",3000);
 const projected=Number(val(f,"projected",30)),actual=Number(val(f,"actual",30));
 if(!title||!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)||!["LOW","MEDIUM","HIGH","COMMITTED"].includes(confidence)||![projected,actual].every(n=>Number.isFinite(n)&&n>=0&&n<=99999999999999))throw Error("Data proyeksi tidak valid");
 const db=sql(),ownerInput=val(f,"owner",36),owner=u.role==="ADMIN"&&ownerInput?ownerInput:u.id;
 if(!/^[0-9a-f-]{36}$/i.test(owner)||!(await db`SELECT id FROM users WHERE id=${owner}`).length)throw Error("PIC tidak valid");
 const lead=val(f,"lead_id",36)||null,customer=val(f,"customer_id",36)||null;
 if(lead&&(!/^[0-9a-f-]{36}$/i.test(lead)||!(await db`SELECT id FROM leads WHERE id=${lead} AND (${u.role==="ADMIN"} OR owner=${u.id})`).length))throw Error("Lead tidak valid");
 if(customer&&(!/^[0-9a-f-]{36}$/i.test(customer)||!(await db`SELECT id FROM customers WHERE id=${customer} AND (${u.role==="ADMIN"} OR owner=${u.id})`).length))throw Error("Customer tidak valid");
 const date=month+"-01";
 if(id){if(!/^[0-9a-f-]{36}$/i.test(id))throw Error("ID tidak valid");const changed=await db`UPDATE cashflows SET title=${title},month=${date},projected=${projected},actual=${actual},confidence=${confidence},notes=${notes},owner=${owner},lead_id=${lead},customer_id=${customer} WHERE id=${id} AND (${u.role==="ADMIN"} OR owner=${u.id}) RETURNING id`;if(!changed.length)throw Error("Akses ditolak");}
 else await db`INSERT INTO cashflows(title,month,projected,actual,confidence,notes,owner,lead_id,customer_id) VALUES(${title},${date},${projected},${actual},${confidence},${notes},${owner},${lead},${customer})`;
 redirect("/cashflow");
}
export async function deleteCashflow(f:FormData){const u=await user();if(!u)redirect("/login");const id=val(f,"id",36);if(!/^[0-9a-f-]{36}$/i.test(id))throw Error("ID tidak valid");await setup();await sql()`DELETE FROM cashflows WHERE id=${id} AND (${u.role==="ADMIN"} OR owner=${u.id})`;redirect("/cashflow");}
