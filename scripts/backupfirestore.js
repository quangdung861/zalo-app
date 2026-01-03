const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

/* // EMULATORS TEST
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

admin.initializeApp({
  projectId: "zalo-app-62a93",
}); */

const BACKUP_DIR = path.resolve(process.cwd(), "backup");

// tạo backup folder
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const serviceAccount = require("../serviceAccountKey.prod.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function backupCollection(name) {
  const snap = await db.collection(name).get();
  const data = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  fs.writeFileSync(
    path.join(BACKUP_DIR, `${name}.json`),
    JSON.stringify(data, null, 2),
    "utf8"
  );

  console.log(`✅ Backup ${name}: ${data.length} docs`);
}

(async () => {
  await backupCollection("users");
  await backupCollection("rooms");
  await backupCollection("messages");
})();
