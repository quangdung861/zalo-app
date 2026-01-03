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

// FORMAT: @user:<uid>:user

async function migrateMentions() {
  const MENTION_REGEX = /@user:([^:]+):user/g;
  const snapshot = await db.collection("messages").get();

  let batch = db.batch();
  let updated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const text = data.text;

    if (typeof text !== "string") continue;

    let mentions = [];
    let newText = "";
    let lastIndex = 0;

    let match;
    while ((match = MENTION_REGEX.exec(text)) !== null) {
      const [full, uid] = match;

      // ✅ QUERY USER BẰNG FIELD uid
      const userQuery = await db
        .collection("users")
        .where("uid", "==", uid)
        .limit(1)
        .get();

      if (userQuery.empty) {
        console.warn("User not found for uid:", uid);
        continue;
      }

      const userData = userQuery.docs[0].data();
      const displayName = userData.displayName || "Unknown";

      // text trước mention
      newText += text.slice(lastIndex, match.index);

      const start = newText.length;
      const mentionText = `@${displayName}`;
      const end = start + mentionText.length;

      newText += mentionText;

      mentions.push({
        id: uid,
        name: displayName,
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

    updated++;

    if (updated % 500 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }

  await batch.commit();
  console.log(`✅ Migrated ${updated} messages`);
}

async function migrateRoomMessageLatest() {
  const MENTION_REGEX = /@user:([^:]+):user/g;
  const snapshot = await db.collection("rooms").get();

  let batch = db.batch();
  let updated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const last = data.messageLastest;

    if (!last || typeof last.text !== "string") continue;

    const text = last.text;

    let mentions = [];
    let newText = "";
    let lastIndex = 0;

    let match;
    while ((match = MENTION_REGEX.exec(text)) !== null) {
      const [full, uid] = match;

      const userSnap = await db
        .collection("users")
        .where("uid", "==", uid)
        .limit(1)
        .get();

      if (userSnap.empty) {
        console.warn("User not found:", uid);
        continue;
      }

      const user = userSnap.docs[0].data();
      const displayName = user.displayName || "Unknown";

      newText += text.slice(lastIndex, match.index);

      const start = newText.length;
      const mentionText = `@${displayName}`;
      const end = start + mentionText.length;

      newText += mentionText;

      mentions.push({
        id: uid,
        name: displayName,
        start,
        end,
      });

      lastIndex = match.index + full.length;
    }

    newText += text.slice(lastIndex);

    if (mentions.length === 0) continue;

    batch.update(doc.ref, {
      "messageLastest.text": newText,
      "messageLastest.mentions": mentions,
    });

    updated++;

    if (updated % 500 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }

  await batch.commit();
  console.log(`✅ Updated messageLastest in ${updated} rooms`);
}

migrateMentions().catch(console.error);
migrateRoomMessageLatest().catch(console.error);
