import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseConfig";

const useFirestore = (collectionName, condition, params) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (!collectionName) return;

    let dbRef = query(
      collection(db, collectionName),
      params?.orderByName
        ? orderBy(params.orderByName, params.orderByType)
        : orderBy("clientCreatedAt", "desc"),
    );

    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        setDocuments([]);
        return;
      }

      dbRef = query(
        dbRef,
        where(condition.fieldName, condition.operator, condition.compareValue),
      );
    }

    const unsubscribe = onSnapshot(
      dbRef,
      (docsSnap) => {
        const docs = docsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocuments(docs);
      },
      (error) => {
        console.error("🔥 onSnapshot messages error:", error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [
    collectionName,
    condition,
    condition?.fieldName,
    condition?.operator,
    condition?.compareValue,
    params?.orderByName,
    params?.orderByType,
  ]);

  return documents;
};

export default useFirestore;
