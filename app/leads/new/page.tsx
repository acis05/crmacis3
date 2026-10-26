import Shell,{guard} from "@/components/shell";import {sql} from "@/lib/db";import LeadForm from "@/components/lead-form";
export const dynamic="force-dynamic";
export default async function NewLead(){const u=await guard();const owners=u.role==="ADMIN"?await sql()`SELECT id,name FROM users ORDER BY name`:[];return <Shell u={u}><h1>Tambah Lead</h1><LeadForm owners={owners.map(o=>({id:o.id,name:o.name}))} admin={u.role==="ADMIN"} me={u.id}/></Shell>;}
