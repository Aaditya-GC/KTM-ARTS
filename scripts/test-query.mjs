import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL);

try {
  const r = await sql`select id from reviews limit 1`;
  console.log("OK", JSON.stringify(r));
} catch (e) {
  console.log("ERROR type:", typeof e);
  console.log("constructor:", e?.constructor?.name);
  console.log("keys:", Object.keys(e));
  console.log("full:", JSON.stringify(e, Object.getOwnPropertyNames(e)));
}
process.exit(0);
