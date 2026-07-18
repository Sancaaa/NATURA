const SYSTEM =
  "Kamu adalah tutor Farmakognosi untuk siswa SMK Farmasi di Indonesia. " +
  "Jawab ringkas (2-4 kalimat), akurat, memakai Bahasa Indonesia yang mudah dipahami, " +
  "dan hanya seputar farmakognosi (simplisia, tanaman obat, kandungan kimia, pembuatan " +
  "simplisia, ekstraksi, alat laboratorium). Jika pertanyaan di luar topik itu, tolak " +
  "dengan sopan dan arahkan kembali ke materi farmakognosi.";

function stub(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("simplisia"))
    return "Simplisia adalah bahan alam berkhasiat obat yang belum diolah kecuali dikeringkan. Ada tiga jenis: nabati (tumbuhan), hewani, dan mineral.";
  if (m.includes("kunyit") || m.includes("kurkumin"))
    return "Kunyit (Curcuma longa) mengandung kurkuminoid sebagai zat aktif utama plus minyak atsiri, berkhasiat antiinflamasi dan hepatoprotektor.";
  if (m.includes("maserasi") || m.includes("perkolasi"))
    return "Maserasi = perendaman simplisia dalam pelarut pada suhu ruang (untuk zat tak tahan panas). Perkolasi = pelarut dialirkan menembus simplisia secara kontinu.";
  return "Maaf, saat ini saya hanya bisa menjawab pertanyaan seputar simplisia, kunyit, maserasi, dan perkolasi. Coba ajukan pertanyaan terkait topik tersebut.";
}

export async function POST(req: Request) {
  let message = "";
  try {
    const body = await req.json();
    message = String(body?.message ?? "");
  } catch {
    // abaikan; message tetap kosong
  }
  if (!message.trim()) {
    return Response.json({ reply: "Silakan tulis pertanyaan.", source: "stub" });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return Response.json({ reply: stub(message), source: "stub" });
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
        }),
      },
    );
    if (!res.ok) {
      return Response.json({ reply: stub(message), source: "stub-fallback" });
    }
    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts as
      | { text?: string }[]
      | undefined;
    const reply =
      parts?.map((p) => p.text ?? "").join("").trim() || stub(message);
    return Response.json({ reply, source: "gemini" });
  } catch {
    return Response.json({ reply: stub(message), source: "stub-error" });
  }
}
