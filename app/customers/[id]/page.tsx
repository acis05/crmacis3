import {notFound} from "next/navigation";import Shell,{guard} from "@/components/shell";import {sql,setup} from "@/lib/db";import CustomerForm from "@/components/customer-form";import DeleteButton from "@/components/delete-button";import {deleteCustomer} from "@/app/actions";
export const dynamic="force-dynamic";
export default async function CustomerDetail({params}:{params:Promise<{id:string}>}){
 const u=await guard();await setup();const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))notFound();const db=sql();const rows=await db`SELECT * FROM customers WHERE id=${id} AND (${u.role==="ADMIN"} OR owner=${u.id})`;if(!rows.length)notFound();const owners=u.role==="ADMIN"?await db`SELECT id,name FROM users ORDER BY name`:[];
 return <Shell u={u}><h1>Customer: {rows[0].name}</h1><CustomerForm customer={rows[0]} owners={owners.map(x=>({id:x.id,name:x.name}))} admin={u.role==="ADMIN"} me={u.id}/><div className="card"><h2>Hapus Customer</h2><p className="muted">Penghapusan permanen.</p><DeleteButton action={deleteCustomer} id={id} what="customer ini"/></div></Shell>;
}
