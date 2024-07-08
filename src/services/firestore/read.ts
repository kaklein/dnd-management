import { DocumentData, Firestore, QueryDocumentSnapshot } from "firebase/firestore"
import { collection, query, where, getDocs } from "firebase/firestore";

export const buildWhereClauses = (query: {[key: string]: string | number | object}) => {
  const entries = Object.entries(query);
  const queries = [];
  for (const entry of entries) {
    queries.push(where(entry[0], "==", entry[1]));
  }
  return queries;
}

export const readData = async (db: Firestore, collectionName: string, queryFilter: {[key: string]: string | number | object}): Promise<DocumentData[]> => {
  const baseDetailsQ = query(collection(db, collectionName), ...buildWhereClauses(queryFilter));
  console.log(baseDetailsQ);
  const baseDetailsSnapshot = await getDocs(baseDetailsQ);
  const docs: DocumentData[] = [];
  baseDetailsSnapshot.forEach((doc) => {
      console.log(doc.id);
      docs.push(doc.data());
  });
  return docs;
}

export const readSingleItem = async (db: Firestore, collectionName: string, queryFilter: {[key: string]: string | number | object}): Promise<DocumentData> => {
  const queryResult = await readData(db, collectionName, queryFilter);
  if (queryResult.length < 1) {
    throw Error(`No matching document found for query: ${queryFilter}`);
  }

  if (queryResult.length > 1) {
    console.log(`Found ${queryResult.length} matching documents; returning the first item.`);
  }

  return queryResult[0];
}
