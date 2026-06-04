import { getEmbedding, cosineSimilarity } from "../src/lib/semanticSearch";

async function main() {
  const query = await getEmbedding("файлы");
  const doc = await getEmbedding("Тут находятся важные файлы для проекта");
  const doc2 = await getEmbedding("Ничего не связано с этим");
  
  console.log("similarity doc1:", cosineSimilarity(query, doc));
  console.log("similarity doc2:", cosineSimilarity(query, doc2));
}
main();
