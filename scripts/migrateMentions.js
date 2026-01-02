/**
 * node migrateMentions.js
 */

const admin = require("firebase-admin");

// 🔥 BẮT BUỘC: trỏ Firestore Admin SDK sang emulator
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

admin.initializeApp({
  projectId: "demo-zalo-app", // tên bất kỳ
});

const db = admin.firestore();

// 👉 kết nối emulator
db.settings({
  host: "localhost:8080",
  ssl: false,
});

// FORMAT: @user:<uid>:user
const MENTION_REGEX = /@user:([^:]+):user/g;

async function migrateMessages() {
  const snapshot = await db.collection("messages").get();

  let batch = db.batch();
  let batchCount = 0;
  let totalUpdated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const text = data.text;

    if (typeof text !== "string") continue;

    let mentions = [];
    let newText = "";
    let lastIndex = 0;

    let match;
    while ((match = MENTION_REGEX.exec(text)) !== null) {
      const [full, uid, name] = match;

      newText += text.slice(lastIndex, match.index);

      const start = newText.length;
      const mentionText = `@${name}`;
      const end = start + mentionText.length;

      newText += mentionText;

      mentions.push({
        id: uid,
        name,
        start,
        end,
      });

      lastIndex = match.index + full.length;
    }

    newText += text.slice(lastIndex);

    if (mentions.length === 0) continue;

    batch.update(doc.ref, {
      text: newText,
      mentions,
    });

    batchCount++;
    totalUpdated++;

    if (batchCount === 500) {
      await batch.commit();
      batch = db.batch();
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`✅ Migration done. Updated ${totalUpdated} messages`);
}

migrateMessages().catch(console.error);
