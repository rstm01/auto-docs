import { getEmbedding } from "../src/lib/semanticSearch";

async function main() {
  try {
    const emb = await getEmbedding("тест");
    console.log("Success! Embedding length:", emb.length);
  } catch (err) {
    console.error("Error during embedding:", err);
  }
}
main();
