"use client";
import {useState} from "react";
export default function DeleteButton({action,id,what}:{action:(form:FormData)=>Promise<void>;id:string;what:string}){
 const [busy,setBusy]=useState(false);
 return <form action={action} onSubmit={e=>{if(!window.confirm("Hapus "+what+" secara permanen? Tindakan ini tidak dapat dibatalkan.")){e.preventDefault();return;}setBusy(true);}}><input type="hidden" name="id" value={id}/><button type="submit" disabled={busy} style={{background:"#b42335"}}>{busy?"Menghapus...":"Hapus"}</button></form>;
}
