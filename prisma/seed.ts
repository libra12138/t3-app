import { PrismaClient, Poem, Sentence, Writer } from "@prisma/client";
import guwen from "./poem/guwen";
import sentence from "./poem/sentence";
import writer from "./poem/writer";

const prisma = new PrismaClient();
async function main() {
  await prisma.poem.createMany({
    data: guwen.map((item) => {
      const id = item._id.$oid;
      let poemItem = { ...item, id, type: item.type.join(",") } as Poem & {
        _id?: { $oid: string };
      };
      delete poemItem._id;
      return poemItem;
    }),
  });

  await prisma.sentence.createMany({
    data: sentence.map((item) => {
      const id = item._id.$oid;
      const sentenceItem = { ...item, id } as Sentence & {
        _id?: { $oid: string };
      };
      delete sentenceItem._id;
      return sentenceItem;
    }),
  });

  await prisma.writer.createMany({
    data: writer.map((item) => {
      const id = item._id.$oid;
      const writerItem = { ...item, id } as Writer & {
        _id?: { $oid: string };
      };
      delete writerItem._id;
      return writerItem;
    }),
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$connect();
  });
