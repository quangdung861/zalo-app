const admin = require("firebase-admin");

/* // EMULATORS TEST
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

admin.initializeApp({
  projectId: "zalo-app-62a93",
}); */

const serviceAccount = require("../serviceAccountKey.prod.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrate() {
  const roomsSnap = await db.collection("rooms").get();

  console.log(`Found ${roomsSnap.size} rooms`);

  let batch = db.batch();
  let count = 0;

  for (const doc of roomsSnap.docs) {
    const data = doc.data();
    const messagesViewed = data.messagesViewed;

    if (!Array.isArray(messagesViewed) || messagesViewed.length === 0) {
      continue;
    }

    // tìm count lớn nhất
    const maxCount = Math.max(...messagesViewed.map((m) => m.count || 0));

    const unreadCount = {};

    messagesViewed.forEach((item) => {
      unreadCount[item.uid] = Math.max(0, maxCount - (item.count || 0));
    });

    const ref = doc.ref;

    batch.update(ref, {
      unreadCount,
      messagesViewed: admin.firestore.FieldValue.delete(),
    });

    count++;

    // Firestore batch giới hạn 500
    if (count % 400 === 0) {
      await batch.commit();
      batch = db.batch();
      console.log(`Committed ${count} rooms`);
    }
  }

  if (count % 400 !== 0) {
    await batch.commit();
  }

  console.log(`Migration done. Updated ${count} rooms`);
}

migrate()
  .then(() => {
    console.log("✅ DONE");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ ERROR", err);
    process.exit(1);
  });
