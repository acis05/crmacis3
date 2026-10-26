import postgres from "postgres";
import bcrypt from "bcryptjs";
const g=globalThis as unknown as {sql?:ReturnType<typeof postgres>;ready?:Promise<void>};
export function sql(){if(!process.env.DATABASE_URL)throw Error("DATABASE_URL belum diatur");return g.sql??=postgres(process.env.DATABASE_URL,{max:5});}
export async function setup(){
 if(!g.ready)g.ready=(async()=>{
  const db=sql();
  await db.begin(async t=>{
   await t`SELECT pg_advisory_xact_lock(20261026)`;
   await t`CREATE TABLE IF NOT EXISTS users(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('ADMIN','SALES')))`;
   await t`CREATE TABLE IF NOT EXISTS leads(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),name TEXT NOT NULL,company TEXT NOT NULL DEFAULT '',phone TEXT NOT NULL DEFAULT '',product TEXT NOT NULL DEFAULT '',value NUMERIC(16,2) NOT NULL DEFAULT 0,status TEXT NOT NULL DEFAULT 'NEW',notes TEXT NOT NULL DEFAULT '',followup DATE,owner UUID NOT NULL REFERENCES users(id),created_at TIMESTAMPTZ DEFAULT now())`;
   await t`CREATE TABLE IF NOT EXISTS activities(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),lead UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,actor UUID NOT NULL REFERENCES users(id),note TEXT NOT NULL,created_at TIMESTAMPTZ DEFAULT now())`;
   const email=process.env.ADMIN_EMAIL?.trim().toLowerCase(),password=process.env.ADMIN_PASSWORD;
   if(email&&password&&password.length>=12){const hash=await bcrypt.hash(password,12);await t`INSERT INTO users(name,email,password,role) VALUES('Administrator',${email},${hash},'ADMIN') ON CONFLICT(email) DO NOTHING`;}
  });
 })().catch(e=>{g.ready=undefined;throw e;});
 await g.ready;
}
