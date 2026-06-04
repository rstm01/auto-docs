import { semanticSearchDocuments } from "../src/server/actions";

async function main() {
  const result = await semanticSearchDocuments("договор", ["123", "456"]);
  console.log(result);
}
main();
