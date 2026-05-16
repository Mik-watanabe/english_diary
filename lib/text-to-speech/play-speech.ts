import { createKey } from "./create-key";
import { getSpeechBlob, setSpeechBlob } from "./db";

export async function playSpeech(text: string) {
  const data = { text };

  const key = await createKey(data);

  let blob = await getSpeechBlob(key);

  if (!blob) {
    const res = await fetch("/api/text-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to generate audio");
    }

    blob = await res.blob();
    await setSpeechBlob(key, blob);
  }

  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);
  await audio.play();

  await new Promise<void>((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      resolve();
    };

    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
      reject(new Error("Audio playback failed"));
    };
  });
}
