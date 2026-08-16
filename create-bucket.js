const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Creating bucket crm_uploads...");
    
    // Check if bucket exists
    const bucket = await prisma.$queryRaw`SELECT * FROM storage.buckets WHERE id = 'crm_uploads'`;
    
    if (bucket.length > 0) {
      console.log("Bucket already exists.");
    } else {
      await prisma.$executeRaw`
        INSERT INTO storage.buckets (id, name, public) 
        VALUES ('crm_uploads', 'crm_uploads', true)
      `;
      console.log("Bucket created successfully.");
      
      // Also insert a default policy for public select/insert if needed, but 'public' bucket might just allow select.
      // Insert policy for insert
      await prisma.$executeRaw`
        CREATE POLICY "Allow public insert" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'crm_uploads');
      `;
      await prisma.$executeRaw`
        CREATE POLICY "Allow public select" ON storage.objects FOR SELECT TO public USING (bucket_id = 'crm_uploads');
      `;
      
      console.log("Policies created successfully.");
    }
  } catch (error) {
    console.error("Error creating bucket:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
