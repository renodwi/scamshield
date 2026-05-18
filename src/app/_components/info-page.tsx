import type { ReactNode } from "react";

import { Icon, type IconName } from "./icon";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type ActivePage = "cara-kerja" | "tips-aman" | "tentang-kami";

type InfoSection = {
  title: string;
  body: string;
};

type InfoPageProps = {
  activePage: ActivePage;
  icon: IconName;
  title: string;
  description: string;
  sections: InfoSection[];
  asideTitle: string;
  asideItems: string[];
  children?: ReactNode;
};

export function InfoPage({ activePage, icon, title, description, sections, asideTitle, asideItems, children }: InfoPageProps) {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-white" />
        <div className="absolute -top-28 right-[-120px] h-80 w-80 rounded-full bg-blue-200/30 blur-3xl sm:h-[30rem] sm:w-[30rem]" />
        <div className="absolute bottom-10 left-[-160px] h-80 w-80 rounded-full bg-indigo-100/70 blur-3xl" />
      </div>

      <SiteHeader activePage={activePage} />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-16">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12">
          <div>
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Icon name={icon} className="h-7 w-7" />
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">{description}</p>
          </div>

          <aside className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-card lg:p-7">
            <h2 className="text-xl font-extrabold text-slate-950">{asideTitle}</h2>
            <ul className="mt-5 space-y-4">
              {asideItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700">
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {sections.map((section, index) => (
            <article key={section.title} className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-card">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {index + 1}
              </span>
              <h2 className="mt-5 text-xl font-extrabold text-slate-950">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
            </article>
          ))}
        </section>

        {children}
      </main>

      <SiteFooter />
    </>
  );
}
