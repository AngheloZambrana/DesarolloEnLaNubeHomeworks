import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();

const badWords = ["tonto", "idiota", "estúpido", "maldito", "imbécil"];

/**
 * Modera un texto reemplazando palabras ofensivas
 * @param {string} text - Texto a moderar
 * @return {string} Texto moderado
 */
function moderateText(text: string): string {
  const regex = new RegExp(`\\b(${badWords.join("|")})\\b`, "gi");
  return text.replace(regex, "[redacted]");
}

export const moderatePosts = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const postsSnapshot = await admin.firestore().collection("posts").get();
    if (postsSnapshot.empty) {
      res.status(404).send("No hay posts para moderar.");
      return;
    }

    const batch = admin.firestore().batch();
    let count = 0;

    postsSnapshot.forEach((doc) => {
      const post = doc.data();
      if (post.text && typeof post.text === "string") {
        const moderatedText = moderateText(post.text);
        if (moderatedText !== post.text) {
          batch.update(doc.ref, {text: moderatedText});
          count++;
        }
      }
    });

    if (count > 0) {
      await batch.commit();
    }

    res.status(200).send(`Posts moderados: ${count}`);
  } catch (error) {
    console.error("Error moderando posts:", error);
    res.status(500).send("Error interno moderando posts.");
  }
});

