export const statuses=["NEW","CONTACTED","HOT","WARM","COLD","OFFER","NEGOTIATION","WON","LOST"];
export const label:Record<string,string>={NEW:"Baru",CONTACTED:"Dihubungi",HOT:"Hot",WARM:"Warm",COLD:"Cold",OFFER:"Kirim Penawaran",NEGOTIATION:"Negosiasi",WON:"Won",LOST:"Lost"};
export const rupiah=(n:unknown)=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(n)||0);
