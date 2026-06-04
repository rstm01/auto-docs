import { getEmbedding, cosineSimilarity } from "../src/lib/semanticSearch";

async function main() {
  const query = await getEmbedding("файлы");
  const doc = await getEmbedding("Документ, содержащий много текста. Тут обсуждаются разные вещи. Например, аренда, покупка, продажи. Также здесь есть некоторые файлы, которые нужно обработать. Но в основном это текст.");
  
  console.log("similarity:", cosineSimilarity(query, doc));
}
main();
