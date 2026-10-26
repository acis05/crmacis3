import Shell,{guard} from "@/components/shell";import {sql,setup} from "@/lib/db";
export const dynamic="force-dynamic";
export default async function Customers({searchParams}:{searchParams:Promise<{q?:string}>}){
 const u=await guard();await setup();const {q:query}=await searchParams;const q=(query||"").slice(0,100);
 const rows=await sql()`SELECT c.id,c.name,c.company,c.phone,c.email,u.name pic FROM customers c JOIN users u ON u.id=c.owner WHERE (${u.role==="ADMIN"} OR c.owner=${u.id}) AND (${!q} OR c.name ILIKE ${"%"+q+"%"} OR c.company ILIKE ${"%"+q+"%"}) ORDER BY c.created_at DESC LIMIT 500`;
 return <Shell u={u}><div className="row"><h1>Daftar Customers</h1><a className="btn" href="/customers/new">+ Tambah Customer</a></div>
 <form className="card row"><input name="q" defaultValue={q} placeholder="Cari customer / perusahaan" style={{maxWidth:320,margin:0}}/><button>Cari</button></form>
 <div className="card table"><table><thead><tr><th>Nama</th><th>Perusahaan</th><th>WhatsApp</th><th>Email</th><th>PIC</th><th>Aksi</th></tr></thead><tbody>{rows.map(x=><tr key={x.id}><td>{x.name}</td><td>{x.company}</td><td>{x.phone}</td><td>{x.email}</td><td>{x.pic}</td><td><a href={"/customers/"+x.id}>Lihat / Edit / Hapus</a></td></tr>)}</tbody></table>{!rows.length&&<p>Belum ada customer.</p>}</div></Shell>;
}
