import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";

const useFirestore = (collectionName, condition, params) => {
  const [documents, setDocuments] = useState([]);
  console.log("🚀 ~ file: useFirestore.js:13 ~ useFirestore ~ documents:", documents)

  useEffect(() => {
    let dbRef = query(
      collection(db, collectionName),
      params?.orderByName
        ? orderBy(params.orderByName, params.orderByType)
        : orderBy("createdAt", "desc")
    );

    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        return;
      }

      dbRef = query(
        dbRef,
        where(condition.fieldName, condition.operator, condition.compareValue)
      );
    }

    onSnapshot(dbRef, (docsSnap) => {
      let documents;
      if (docsSnap.empty) {
        documents = [];
      } else {
        documents = docsSnap.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            ...data,
            id: id,
          };
        });
      }
      setDocuments(documents);
    });
  }, [collectionName, condition]);

  return documents;
};

export default useFirestore;
