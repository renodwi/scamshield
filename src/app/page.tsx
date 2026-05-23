"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent, DragEvent } from "react";
import { useRef, useState } from "react";
import { SiteFooter } from "./_components/site-footer";
import { SiteHeader } from "./_components/site-header";
import { getAnalysisDeviceId, saveAnalysisResult } from "./_lib/analysis-result-store";
import { extractTextFromImage } from "./_lib/ocr";
import { clearUploadedPreviews, saveUploadedPreviews } from "./_lib/upload-preview-store";

type IconName =
  | "shield-check"
  | "menu"
  | "shield"
  | "upload"
  | "panel-left"
  | "cloud-upload"
  | "lock-keyhole"
  | "scan-search"
  | "sparkles"
  | "lock"
  | "circle-help"
  | "check"
  | "triangle-alert";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILE_COUNT = 5;
const MAX_CHAT_TEXT_LENGTH = 8_000;
const MAX_ADDITIONAL_INFO_LENGTH = 1_000;
const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const iconPaths: Record<IconName, React.ReactNode> = {
  "shield-check": (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.6 8.9a1 1 0 0 1-.8 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .6-.9l7-3a1 1 0 0 1 .8 0l7 3a1 1 0 0 1 .6.9z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  menu: (
    <>
      <path d="M4 12h16" />
      <path d="M4 18h16" />
      <path d="M4 6h16" />
    </>
  ),
  shield: <path d="M20 13c0 5-3.5 7.5-7.6 8.9a1 1 0 0 1-.8 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .6-.9l7-3a1 1 0 0 1 .8 0l7 3a1 1 0 0 1 .6.9z" />,
  upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m17 8-5-5-5 5" />
      <path d="M12 3v12" />
    </>
  ),
  "panel-left": (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </>
  ),
  "cloud-upload": (
    <>
      <path d="M12 13v8" />
      <path d="m16 17-4-4-4 4" />
      <path d="M20.4 16.7A5 5 0 0 0 18 7h-1.3A8 8 0 1 0 4 15.3" />
    </>
  ),
  "lock-keyhole": (
    <>
      <circle cx="12" cy="16" r="1" />
      <rect width="18" height="12" x="3" y="10" rx="2" />
      <path d="M7 10V7a5 5 0 0 1 10 0v3" />
    </>
  ),
  "scan-search": (
    <>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <circle cx="11" cy="11" r="3" />
      <path d="m16 16-2.2-2.2" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3-1.9 5.8L4 11l6.1 2.2L12 19l1.9-5.8L20 11l-6.1-2.2z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </>
  ),
  lock: (
    <>
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  "circle-help": (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  "triangle-alert": (
    <>
      <path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
};

function Icon({
  name,
  className,
  strokeWidth = 2,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"upload" | "text">("upload");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const [isDropActive, setIsDropActive] = useState(false);
  const [chatText, setChatText] = useState("");
  const [useAdditionalInfo, setUseAdditionalInfo] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const toastTimerRef = useRef<number | undefined>(undefined);
  const statusTimersRef = useRef<number[]>([]);

  const trimmedLength = chatText.trim().length;
  const trimmedAdditionalInfo = additionalInfo.trim();
  const isUpload = activeTab === "upload";

  function showToast(message: string) {
    setToastMessage(message);

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage("");
    }, 2600);
  }

  function validateFile(file?: File) {
    if (!file) return false;

    if (!allowedTypes.includes(file.type)) {
      showToast("Format file tidak didukung. Gunakan PNG, JPG, JPEG, atau WebP.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      showToast("Ukuran file maksimal 10MB.");
      return false;
    }

    return true;
  }

  function handleFiles(fileList: FileList | File[] | null) {
    const files = Array.from(fileList ?? []);

    if (files.length === 0) return;

    if (files.length > MAX_FILE_COUNT) {
      showToast("Maksimal upload 5 gambar.");
      return;
    }

    if (!files.every(validateFile)) return;

    setSelectedFiles(files);
    setFileNames(files.map((file) => file.name));
    setFilePreviewUrls((currentUrls) => {
      currentUrls.forEach((url) => URL.revokeObjectURL(url));
      return files.map((file) => URL.createObjectURL(file));
    });
    saveUploadedPreviews(files);
    showToast(`${files.length} screenshot siap dianalisis.`);
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    handleFiles(event.target.files);
  }

  function handleDrag(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDropActive(true);
  }

  function handleDragLeave(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDropActive(false);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDropActive(false);
    handleFiles(event.dataTransfer.files);
  }

  async function handleAnalyze() {
    if (isAnalyzing) return;

    const isTextMode = activeTab === "text";
    const trimmedText = chatText.trim();

    if (!isTextMode && selectedFiles.length === 0) {
      showToast("Pilih minimal 1 gambar untuk diperiksa.");
      return;
    }

    if (isTextMode && trimmedText.length < 20) {
      showToast("Masukkan minimal 20 karakter percakapan.");
      return;
    }

    const formData = new FormData();

    let combinedChatText = trimmedText;

    if (isTextMode) {
      formData.append("chatText", trimmedText);
      clearUploadedPreviews();
    } else {
      setIsOcrProcessing(true);
      setAnalysisStatus("OCR membaca teks pada gambar...");

      const ocrText = await extractTextFromImages(selectedFiles);
      combinedChatText = [trimmedText, ocrText].filter(Boolean).join("\n\n");

      if (combinedChatText) {
        formData.append("chatText", combinedChatText);
      }

      selectedFiles.forEach((file) => formData.append("images", file));

      if (useAdditionalInfo && trimmedAdditionalInfo) {
        formData.append("additionalInfo", trimmedAdditionalInfo);
      }
    }

    startAnalysisStatus();
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "x-scamshield-device-id": getAnalysisDeviceId(),
        },
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analisis gagal diproses.");
      }

      saveAnalysisResult(data.result, combinedChatText || trimmedAdditionalInfo);
      router.push("/hasil-analisa");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Analisis gagal diproses.";
      showToast(message);
    } finally {
      stopAnalysisStatus();
      setIsOcrProcessing(false);
      setIsAnalyzing(false);
    }
  }

  async function extractTextFromImages(files: File[]) {
    const extractedTexts: string[] = [];

    for (const [index, file] of files.entries()) {
      setAnalysisStatus(`OCR membaca gambar ${index + 1}/${files.length}...`);
      extractedTexts.push(await extractTextFromImage(file));
    }

    return extractedTexts.filter(Boolean).join("\n\n");
  }

  function startAnalysisStatus() {
    stopAnalysisStatus();
    setAnalysisStatus("Periksa sedang dimulai...");

    const messages = [
      "AI membaca percakapan...",
      "AI memeriksa secara mendalam...",
      "AI menyusun hasil analisis...",
    ];

    statusTimersRef.current = messages.map((message, index) =>
      window.setTimeout(() => {
        setAnalysisStatus(message);
      }, (index + 1) * 1400),
    );
  }

  function stopAnalysisStatus() {
    statusTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    statusTimersRef.current = [];
    setAnalysisStatus("");
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-white" />
        <div className="absolute -top-28 right-[-120px] h-80 w-80 rounded-full bg-blue-200/30 blur-3xl sm:h-[30rem] sm:w-[30rem]" />
        <div className="absolute bottom-10 left-[-160px] h-80 w-80 rounded-full bg-indigo-100/70 blur-3xl" />
      </div>

      <SiteHeader activePage="beranda" />

      <main id="beranda" className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-16">
        <section className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/75 px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm sm:hidden">
              <Icon name="shield" className="h-4 w-4" />
              Cepat • Akurat • Privasi Terjaga
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:mt-0 lg:text-6xl">
              Cek Percakapan,
              <span className="block text-blue-600">Hindari Penipuan.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Upload screenshot atau paste teks percakapan untuk mendeteksi potensi penipuan dengan AI.
            </p>

            <div className="mt-5 p-3 bg-blue-600 text-xl font-black text-white">
              Didukung oleh Gemini AI.
            </div>

            <div className="mt-6 hidden items-center gap-3 text-sm font-semibold text-slate-700 sm:flex">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white">
                <Icon name="shield-check" className="h-4 w-4" />
              </span>
              <span>Cepat</span>
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              <span>Akurat</span>
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              <span>Privasi Terjaga</span>
            </div>
          </div>

          <div className="hero-blob relative order-1 min-h-[220px] overflow-hidden rounded-[2rem] lg:order-2 lg:min-h-[360px]">
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/70 sm:h-72 sm:w-72 lg:h-96 lg:w-96" />

            <div className="absolute left-[48%] top-[16%] h-52 w-36 rotate-3 rounded-[2rem] bg-white shadow-soft sm:h-64 sm:w-44 lg:h-72 lg:w-52">
              <div className="mx-auto mt-8 h-3 w-24 rounded-full bg-slate-200" />
              <div className="mx-7 mt-9 h-12 rounded-xl bg-blue-100">
                <div className="ml-5 pt-4">
                  <div className="h-2 w-24 rounded-full bg-blue-300" />
                  <div className="mt-2 h-2 w-16 rounded-full bg-blue-300" />
                </div>
              </div>
              <div className="mx-7 mt-9 h-12 rounded-xl bg-slate-100">
                <div className="ml-5 pt-4">
                  <div className="h-2 w-24 rounded-full bg-slate-300" />
                  <div className="mt-2 h-2 w-20 rounded-full bg-slate-300" />
                </div>
              </div>
            </div>

            <div className="absolute left-[28%] top-[30%] grid h-28 w-24 place-items-center rounded-[2rem] bg-gradient-to-br from-blue-400 to-blue-700 text-white shadow-xl shadow-blue-700/20 sm:h-36 sm:w-32 lg:left-[22%] lg:h-40 lg:w-36">
              <Icon name="check" className="h-14 w-14 sm:h-16 sm:w-16" strokeWidth={3} />
            </div>

            <div className="absolute right-[8%] top-[55%] grid h-16 w-16 rotate-3 place-items-center rounded-2xl bg-gradient-to-br from-rose-300 to-rose-500 text-white shadow-xl shadow-rose-500/20 sm:h-20 sm:w-20">
              <Icon name="triangle-alert" className="h-9 w-9 sm:h-11 sm:w-11" />
            </div>

            <div className="absolute bottom-8 right-14 hidden h-28 w-28 rounded-full border-4 border-blue-100 lg:block" />
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.45fr_0.78fr] lg:gap-8">
          <div className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-card sm:p-6">
            <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/80">
              <button
                className={`${isUpload ? "tab-active" : "border-transparent text-slate-500"} flex items-center justify-center gap-2 border-b-2 px-3 py-4 text-sm font-bold transition hover:text-blue-600 sm:text-base`}
                type="button"
                onClick={() => setActiveTab("upload")}
              >
                <Icon name="upload" className="h-5 w-5" />
                <span className="hidden sm:inline">Upload Screenshot</span>
                <span className="sm:hidden">Upload</span>
              </button>

              <button
                className={`${!isUpload ? "tab-active" : "border-transparent text-slate-500"} flex items-center justify-center gap-2 border-b-2 px-3 py-4 text-sm font-bold transition hover:text-blue-600 sm:text-base`}
                type="button"
                onClick={() => setActiveTab("text")}
              >
                <Icon name="panel-left" className="h-5 w-5" />
                <span className="hidden sm:inline">Paste Teks Percakapan</span>
                <span className="sm:hidden">Teks</span>
              </button>
            </div>

            {isUpload ? (
              <div className="pt-5">
                <label
                  htmlFor="fileInput"
                  className={`${isDropActive ? "drop-active" : ""} flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50/30 to-white px-4 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/50`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input id="fileInput" type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="sr-only" multiple onChange={handleFileInput} />

                  <div className="grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-blue-600">
                    <Icon name="cloud-upload" className="h-10 w-10" />
                  </div>

                  {fileNames.length > 0 ? (
                    <div className="mt-5 w-full max-w-xl">
                      <p className="text-lg font-bold text-slate-900 sm:text-xl">{fileNames.length} gambar dipilih</p>
                      <ul className="mt-3 space-y-2 rounded-2xl bg-white/75 p-3 text-left text-sm font-medium text-slate-600 shadow-sm">
                        {fileNames.map((name, index) => (
                          <li key={`${name}-${index}`} className="truncate">
                            {name}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                        {filePreviewUrls.map((url, index) => (
                          <div key={`${url}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div
                              className="aspect-square bg-slate-50 bg-contain bg-center bg-no-repeat"
                              role="img"
                              aria-label={`Preview gambar ${index + 1}`}
                              style={{ backgroundImage: `url(${url})` }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-5 text-lg font-bold text-slate-900 sm:text-xl">Drag & drop screenshot di sini</p>
                  )}
                  <p className="mt-2 text-sm text-slate-500">atau</p>

                  <span className="mt-5 inline-flex rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                    Pilih File
                  </span>

                  <p className="mt-5 text-sm text-slate-500">Format: PNG, JPG, JPEG, WebP (Maks. 10MB per file, maks. 5 gambar)</p>
                </label>

                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-extrabold text-slate-950">Informasi Tambahan</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Tambahkan konteks singkat agar AI membaca screenshot dengan lebih tepat.
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-pressed={useAdditionalInfo}
                      className={`${useAdditionalInfo ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white text-blue-700 shadow-sm"} inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-100 px-4 py-2.5 text-sm font-bold transition hover:border-blue-300`}
                      onClick={() => setUseAdditionalInfo((value) => !value)}
                    >
                      <Icon name="sparkles" className="h-4 w-4" />
                      {useAdditionalInfo ? "Konteks Aktif" : "Tambah Konteks"}
                    </button>
                  </div>

                  {useAdditionalInfo ? (
                    <div className="mt-4">
                      <textarea
                        rows={4}
                        className="w-full resize-none rounded-2xl border border-blue-100 bg-white p-4 text-sm leading-7 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        placeholder="Contoh: akun ini mengaku dari bank, meminta kode OTP, atau percakapan terjadi setelah klik iklan..."
                        value={additionalInfo}
                        maxLength={MAX_ADDITIONAL_INFO_LENGTH}
                        onChange={(event) => setAdditionalInfo(event.target.value)}
                      />
                      <div className="mt-2 flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                        <span>Opsional, boleh dikosongkan.</span>
                        <span>{trimmedAdditionalInfo.length}/{MAX_ADDITIONAL_INFO_LENGTH}</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-2xl bg-blue-50 px-4 py-4 text-sm font-medium text-blue-700">
                  <Icon name="lock-keyhole" className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>Data Anda hanya digunakan untuk memproses analisis AI dan menampilkan hasil pemeriksaan.</p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {analysisStatus ? (
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                      {isOcrProcessing ? (
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                      ) : null}
                      {analysisStatus}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500">Pilih gambar, lalu mulai pemeriksaan AI.</p>
                  )}
                  <button
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto"
                    type="button"
                    disabled={selectedFiles.length === 0 || isAnalyzing}
                    onClick={handleAnalyze}
                  >
                    <Icon name="scan-search" className="h-5 w-5" />
                    {isOcrProcessing ? "Membaca OCR..." : isAnalyzing ? "Memeriksa..." : "Mulai Periksa"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-5">
                <textarea
                  rows={10}
                  className="min-h-[260px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm leading-7 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Paste teks percakapan mencurigakan di sini..."
                  value={chatText}
                  maxLength={MAX_CHAT_TEXT_LENGTH}
                  onChange={(event) => setChatText(event.target.value)}
                />

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">{trimmedLength} karakter</p>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                    type="button"
                    disabled={trimmedLength < 20 || isAnalyzing}
                    onClick={handleAnalyze}
                  >
                    <Icon name="scan-search" className="h-5 w-5" />
                    {isAnalyzing ? "Memeriksa..." : "Mulai Periksa"}
                  </button>
                </div>
                {analysisStatus ? (
                  <div className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                    {analysisStatus}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <aside className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-card lg:p-7">
            <section id="cara-kerja">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon name="sparkles" className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-extrabold">Cara Kerja</h2>
              </div>

              <ol className="space-y-6">
                <li className="relative flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">1</span>
                  <p className="pt-1 text-sm leading-6 text-slate-600">Upload screenshot atau paste teks percakapan.</p>
                </li>
                <li className="relative flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">2</span>
                  <p className="pt-1 text-sm leading-6 text-slate-600">AI akan menganalisis konten percakapan.</p>
                </li>
                <li className="relative flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">3</span>
                  <p className="pt-1 text-sm leading-6 text-slate-600">Dapatkan hasil analisis dan tingkat risiko penipuan.</p>
                </li>
              </ol>
            </section>

            <div className="my-7 h-px bg-slate-200" />

            <section id="tips">
              <div className="mb-3 flex items-center gap-3">
                <Icon name="lock" className="h-6 w-6 text-emerald-600" />
                <h2 className="text-lg font-extrabold">Privasi Terjamin</h2>
              </div>
              <p className="text-sm leading-7 text-slate-600">
                Hasil analisis disimpan di perangkat Anda agar bisa dibuka kembali setelah pemeriksaan selesai.
              </p>
            </section>

            <section id="tentang" className="mt-8">
              <div className="mb-3 flex items-center gap-3">
                <Icon name="circle-help" className="h-6 w-6 text-indigo-600" />
                <h2 className="text-lg font-extrabold">Perlu Bantuan?</h2>
              </div>
              <p className="text-sm leading-7 text-slate-600">
                Pelajari lebih lanjut tentang tips menghindari penipuan di halaman{" "}
                <a href="/tips-aman" className="font-bold text-blue-600 hover:text-blue-700">
                  Tips Aman
                </a>
                .
              </p>
            </section>
          </aside>
        </section>
      </main>

      <SiteFooter />

      <div className={`${toastMessage ? "block" : "hidden"} pointer-events-none fixed bottom-5 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-2xl`}>
        <span>{toastMessage || "Berhasil."}</span>
      </div>
    </>
  );
}
