const { Client } = require('pg');

async function main() {
  const connectionString = "postgresql://postgres.qixnclandqhmmnecqzdq:Jujuba1801%2A@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1";
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log("Connected to Supabase.");

    // Create the bucket
    await client.query(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('crm_uploads', 'crm_uploads', true)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("Bucket crm_uploads ensured.");

    // Policy for inserts
    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE policyname = 'Allow public insert' AND tablename = 'objects' AND schemaname = 'storage'
          ) THEN
              CREATE POLICY "Allow public insert" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'crm_uploads');
          END IF;
      END
      $$;
    `);
    
    // Policy for selects
    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE policyname = 'Allow public select' AND tablename = 'objects' AND schemaname = 'storage'
          ) THEN
              CREATE POLICY "Allow public select" ON storage.objects FOR SELECT TO public USING (bucket_id = 'crm_uploads');
          END IF;
      END
      $$;
    `);
    console.log("Policies ensured.");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

main();
