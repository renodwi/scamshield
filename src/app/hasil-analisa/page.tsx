"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConfidenceMeter } from "../_components/confidence-meter";
import { Icon } from "../_components/icon";
import { SiteFooter } from "../_components/site-footer";
import { SiteHeader } from "../_components/site-header";
import { getAnalysisResult, type AnalysisResult } from "../_lib/analysis-result-store";
import { getUploadedPreviews, type UploadedPreview } from "../_lib/upload-preview-store";

export default function HasilAnalisaPage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadedPreviews, setUploadedPreviews] = useState<UploadedPreview[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedResult = getAnalysisResult();

      if (!storedResult) {
        router.replace("/");
        return;
      }

      setAnalysisResult(storedResult);
      setUploadedPreviews(getUploadedPreviews());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  if (!analysisResult) {
    return <main className="hidden" aria-hidden="true" />;
  }

  const confidence = analysisResult.confidence;
  const riskTone =
    analysisResult.riskLevel === "high"
      ? {
          text: "text-red-600",
          badge: "bg-red-100 text-red-500",
        }
      : analysisResult.riskLevel === "safe"
        ? {
            text: "text-emerald-600",
            badge: "bg-emerald-100 text-emerald-600",
          }
      : analysisResult.riskLevel === "low"
        ? {
            text: "text-emerald-600",
            badge: "bg-emerald-100 text-emerald-600",
          }
        : {
            text: "text-orange-600",
            badge: "bg-orange-100 text-orange-500",
          };

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-white" />
        <div className="absolute -top-28 right-[-120px] h-80 w-80 rounded-full bg-blue-200/30 blur-3xl sm:h-[30rem] sm:w-[30rem]" />
        <div className="absolute bottom-10 left-[-160px] h-80 w-80 rounded-full bg-indigo-100/70 blur-3xl" />
      </div>

      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-14">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">Report AI</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Hasil Analisis AI
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
          >
            Analisis Ulang
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <aside className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-card sm:p-6 lg:sticky lg:top-24">
            <div className="flex items-start justify-between gap-5">
              <div className="flex min-w-0 gap-3">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${riskTone.badge}`}>
                  <Icon name="triangle-alert" className="h-6 w-6" />
                </span>
                <div>
                  <h2 className={`text-xl font-extrabold ${riskTone.text}`}>{analysisResult.riskLabel}</h2>
                  <p className="mt-4 text-sm font-medium leading-6 text-slate-600">
                    {analysisResult.summary}
                  </p>
                  <ConfidenceMeter value={confidence} />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-blue-50 p-4">
              <p className="text-sm font-bold text-blue-700">Penjelasan AI</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {analysisResult.aiExplanation}
              </p>
            </div>
          </aside>

          <div className="space-y-6">
            {uploadedPreviews.length > 0 && (
              <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-card sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon name="shield" className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-950">Gambar Diunggah</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Screenshot percakapan yang menjadi bahan analisis.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {uploadedPreviews.map((preview, index) => (
                    <figure key={`${preview.name}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <div
                        className="aspect-[4/5] bg-white bg-contain bg-center bg-no-repeat"
                        role="img"
                        aria-label={`Screenshot percakapan ${index + 1}`}
                        style={{ backgroundImage: `url(${preview.url})` }}
                      />
                      <figcaption className="truncate border-t border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">
                        {preview.name}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-card sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon name="scan-search" className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-extrabold text-slate-950">Temuan Utama</h2>
              </div>

              <div className="space-y-4">
                {analysisResult.findings.map((finding) => (
                  <article
                    key={finding.title}
                    className={
                      finding.severity === "high"
                        ? "flex gap-4 rounded-2xl border border-red-100 bg-red-50/70 p-4"
                        : finding.severity === "medium"
                          ? "flex gap-4 rounded-2xl border border-amber-100 bg-amber-50/70 p-4"
                          : "flex gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4"
                    }
                  >
                    <span
                      className={
                        finding.severity === "high"
                          ? "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-100 text-red-500"
                          : finding.severity === "medium"
                            ? "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-500"
                            : "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600"
                      }
                    >
                      {finding.severity === "low" ? (
                        <Icon name="shield" className="h-5 w-5" />
                      ) : (
                        <Icon name="triangle-alert" className="h-5 w-5" />
                      )}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-slate-950">{finding.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{finding.description}</p>
                      <blockquote className="mt-3 rounded-xl border border-white/80 bg-white/75 px-3 py-2 text-sm font-semibold text-slate-700">
                        Bukti: {finding.evidence}
                      </blockquote>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[1.6rem] border border-blue-100 bg-blue-50 p-5 shadow-card sm:p-6">
              <div className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white">
                  <Icon name="shield-check" className="h-7 w-7" />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-950">Rekomendasi</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {analysisResult.recommendation}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
