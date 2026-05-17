import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const about = await prisma.about.findFirst();
    if (!about) {
      console.log('No About record found.');
      return;
    }

    console.log('Email:', about.email);
    console.log('Phone:', about.phone);
    console.log('Bio length:', about.bio.length);
    console.log('Bio text:', about.bio);
    console.log('Statement length:', about.statement.length);
    console.log('CV length:', about.cv.length);
    console.log('CV first 700 chars:', about.cv.substring(0, 700));
    console.log("CV contains 'ΓÇ':", about.cv.includes('ΓÇ'));

    const headers = ['Personal Achievements', 'Solo Exhibitions', 'Selected Group Art Exhibitions'];
    headers.forEach(header => {
      const count = (about.cv.match(new RegExp(header, 'g')) || []).length;
      console.log(\Count of '\':\, count);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.\();
  }
}

main();
