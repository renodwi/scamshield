"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "../_components/icon";
import { SiteFooter } from "../_components/site-footer";
import { SiteHeader } from "../_components/site-header";
import {
  activateAnalysisHistoryEntry,
  deleteAnalysisHistoryEntry,
  getAnalysisHistory,
  type AnalysisHistoryEntry,
} from "../_lib/analysis-result-store";

export default function RiwayatPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<AnalysisHistoryEntry[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setEntries(getAnalysisHistory());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function handleView(entry: AnalysisHistoryEntry) {
    activateAnalysisHistoryEntry(entry);
    router.push("/hasil-analisa");
  }

  function handleDelete(id: string) {
    deleteAnalysisHistoryEntry(id);
    setEntries((currentEntries) => currentEntries.filter((entry) => entry.id !== id));
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-white" />
        <div className="absolute -top-28 right-[-120px] h-80 w-80 rounded-full bg-blue-200/30 blur-3xl sm:h-[30rem] sm:w-[30rem]" />
      </div>

      <SiteHeader activePage="riwayat" />

      <main className="mx-auto max-w-5xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-14">
        <div className="mb-6">
          <p className="text-sm font-semibold text-blue-600">Riwayat Lokal</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Riwayat Analisis</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Data ini disimpan di browser Anda untuk membuka ulang hasil pemeriksaan terakhir.
          </p>
        </div>

        {entries.length === 0 ? (
          <section className="rounded-[1.6rem] border border-slate-200 bg-white p-6 text-center shadow-card">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
              <Icon name="scan-search" className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-extrabold text-slate-950">Belum ada riwayat</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Mulai analisis baru untuk menyimpan ringkasan di sini.</p>
          </section>
        ) : (
          <section className="space-y-4">
            {entries.map((entry) => (
              <article key={entry.id} className="rounded-[1.2rem] border border-slate-200 bg-white p-5 shadow-card">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${getRiskBadgeClass(entry.result.riskLevel)}`}>
                        {entry.result.riskLabel}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{formatDate(entry.createdAt)}</span>
                    </div>
                    <h2 className="mt-3 text-lg font-extrabold text-slate-950">{entry.result.summary}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{entry.sourceExcerpt}</p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                      onClick={() => handleView(entry)}
                    >
                      Lihat Detail
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:text-red-600"
                      onClick={() => handleDelete(entry.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}

function getRiskBadgeClass(riskLevel: AnalysisHistoryEntry["result"]["riskLevel"]) {
  if (riskLevel === "high") return "bg-red-100 text-red-600";
  if (riskLevel === "medium") return "bg-amber-100 text-amber-600";

  return "bg-emerald-100 text-emerald-600";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
