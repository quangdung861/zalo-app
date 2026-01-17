const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.prod.json");

/* // EMULATORS TEST
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

admin.initializeApp({
  projectId: "zalo-app-62a93",
}); */

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function backfillUnreadMember() {
  const roomsRef = db.collection("rooms");
  const snapshot = await roomsRef.get();

  console.log(`Found ${snapshot.size} rooms`);

  let batch = db.batch();
  let batchCount = 0;
  let updated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();

    const unreadCount = data.unreadCount || {};
    const oldUnreadMember = Array.isArray(data.unreadMembers)
      ? data.unreadMembers
      : null;

    // 👉 build unreadMembers mới từ unreadCount > 0
    const newUnreadMembers = Object.entries(unreadCount)
      .filter(([_, count]) => typeof count === "number" && count > 0)
      .map(([uid]) => uid);

    // ===== CASE 1: CHƯA CÓ unreadMembers =====
    if (oldUnreadMember === null) {
      batch.update(doc.ref, {
        unreadMembers: newUnreadMembers,
      });

      batchCount++;
      updated++;
    } else {
      // ===== CASE 2: ĐÃ CÓ unreadMembers -> SO SÁNH =====
      const isSame =
        newUnreadMembers.length === oldUnreadMember.length &&
        newUnreadMembers.every((uid) => oldUnreadMember.includes(uid));

      if (isSame) continue;

      batch.update(doc.ref, {
        unreadMembers: newUnreadMembers,
      });

      batchCount++;
      updated++;
    }

    // Firestore limit
    if (batchCount === 450) {
      await batch.commit();
      batch = db.batch();
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`✅ Updated ${updated} rooms`);
}

backfillUnreadMember()
  .then(() => {
    console.log("🎉 Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
