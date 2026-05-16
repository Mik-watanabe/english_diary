type DataProps = {
  text: string;
  voice: string;
  model: string;
};

export async function createKey(data: DataProps) {
  const input = JSON.stringify(data);

  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );

  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
