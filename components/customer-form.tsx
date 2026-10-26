import {saveCustomer} from "@/app/actions";
type Customer={id?:string;name?:string;company?:string;phone?:string;email?:string;address?:string;notes?:string;owner?:string};
export default function CustomerForm({customer,owners,admin,me}:{customer?:Customer;owners:{id:string;name:string}[];admin:boolean;me:string}){
 return <form className="card" action={saveCustomer}>{customer?.id&&<input type="hidden" name="id" value={customer.id}/>}
 <div className="fields"><label>Nama customer *<input name="name" required maxLength={150} defaultValue={customer?.name}/></label>
 <label>Perusahaan<input name="company" maxLength={150} defaultValue={customer?.company}/></label>
 <label>Nomor WhatsApp<input name="phone" maxLength={50} defaultValue={customer?.phone}/></label>
 <label>Email<input name="email" type="email" maxLength={200} defaultValue={customer?.email}/></label>
 {admin&&<label>Sales PIC<select name="owner" defaultValue={customer?.owner||me}>{owners.map(o=><option value={o.id} key={o.id}>{o.name}</option>)}</select></label>}</div>
 <label>Alamat<textarea name="address" rows={2} maxLength={1000} defaultValue={customer?.address}/></label>
 <label>Catatan<textarea name="notes" rows={3} maxLength={5000} defaultValue={customer?.notes}/></label>
 <button>Simpan Customer</button> <a className="btn secondary" href="/customers">Kembali</a></form>;
}
