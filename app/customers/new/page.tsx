import Shell,{guard} from "@/components/shell";import CustomerForm from "@/components/customer-form";import {sql,setup} from "@/lib/db";
export const dynamic="force-dynamic";
export default async function NewCustomer(){const u=await guard();await setup();const owners=u.role==="ADMIN"?await sql()`SELECT id,name FROM users ORDER BY name`:[];return <Shell u={u}><h1>Tambah Customer</h1><CustomerForm owners={owners.map(x=>({id:x.id,name:x.name}))} admin={u.role==="ADMIN"} me={u.id}/></Shell>;}
