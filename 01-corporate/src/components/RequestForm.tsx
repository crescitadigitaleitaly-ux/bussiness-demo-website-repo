"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowRight, CheckCircle2, Info, Loader2 } from "lucide-react";
import { consultationSchema, contactSchema, type RequestInput } from "@/lib/schema";
import type { Dictionary, Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  t: Dictionary["form"];
  kind: "contact" | "consultation";
  areas?: string[];
};

type Status = "idle" | "success" | "error";

export function RequestForm({ locale, t, kind, areas = [] }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  // Time of first interaction, used by the server-side spam check.
  const [startedAt, setStartedAt] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequestInput>({
    resolver: zodResolver(kind === "contact" ? contactSchema : consultationSchema),
    defaultValues: { kind, contactPref: "email", startedAt: 0 } as Partial<RequestInput>,
    shouldFocusError: true,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  });

  // Errors are keyed by name rather than typed per variant; both schemas share these fields.
  const err = errors as Partial<Record<string, FieldError>>;
  const msg = (name: string) => {
    const key = err[name]?.message as keyof typeof t.errors | undefined;
    return key ? (t.errors[key] ?? key) : undefined;
  };
  const fieldProps = (name: string) => ({
    id: `${kind}-${name}`,
    "aria-invalid": err[name] ? true : undefined,
    "aria-describedby": err[name] ? `${kind}-${name}-error` : undefined,
  });

  if (status === "success") {
    return (
      <motion.div
        ref={focusOnMount}
        tabIndex={-1}
        role="status"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-line bg-surface p-8 sm:p-10"
      >
        <CheckCircle2 className="size-10 text-accent" aria-hidden />
        <h3 className="mt-6 text-2xl font-medium tracking-tight">{t.successTitle}</h3>
        <p className="mt-3 max-w-prose leading-relaxed text-muted">{t.successText}</p>
        <button
          type="button"
          className="btn-ghost mt-8"
          onClick={() => {
            reset();
            setStartedAt(0);
            setStatus("idle");
          }}
        >
          {t.again}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} onFocusCapture={() => startedAt || setStartedAt(Date.now())} noValidate className="rounded-3xl border border-line bg-surface p-6 sm:p-10">
      <p className="mb-8 flex items-start gap-2.5 rounded-xl bg-mist px-4 py-3 text-sm text-ink/80">
        <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
        {t.demoNotice}
      </p>

      <input type="hidden" {...register("kind")} />
      {/* Honeypot: visually hidden, skipped by keyboard and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${kind}-website`}>{t.honeypot}</label>
        <input id={`${kind}-website`} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={t.name} id={`${kind}-name`} error={msg("name")}>
          <input className="field" autoComplete="name" {...fieldProps("name")} {...register("name")} />
        </Field>
        {kind === "consultation" && (
          <Field label={t.company} id={`${kind}-company`} optional={t.optional}>
            <input className="field" autoComplete="organization" {...fieldProps("company")} {...register("company")} />
          </Field>
        )}
        <Field label={t.email} id={`${kind}-email`} error={msg("email")}>
          <input className="field" type="email" autoComplete="email" inputMode="email" {...fieldProps("email")} {...register("email")} />
        </Field>
        {kind === "consultation" && (
          <>
            <Field label={t.phone} id={`${kind}-phone`} error={msg("phone")} optional={t.optional}>
              <input className="field" type="tel" autoComplete="tel" inputMode="tel" {...fieldProps("phone")} {...register("phone")} />
            </Field>
            <Field label={t.area} id={`${kind}-area`} error={msg("area")}>
              <select className="field appearance-none" defaultValue="" {...fieldProps("area")} {...register("area")}>
                <option value="" disabled>{t.areaPlaceholder}</option>
                {areas.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
            <Field label={t.size} id={`${kind}-size`} optional={t.optional}>
              <select className="field appearance-none" defaultValue="" {...fieldProps("size")} {...register("size")}>
                <option value="">{t.sizePlaceholder}</option>
                {t.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label={t.date} id={`${kind}-date`} error={msg("date")}>
              <input className="field" type="date" lang={locale} onFocus={(e) => (e.currentTarget.min = new Date().toISOString().slice(0, 10))} {...fieldProps("date")} {...register("date")} />
            </Field>
            <fieldset>
              <legend className="label">{t.contactPref}</legend>
              <div className="flex gap-3">
                {(["email", "phone"] as const).map((v) => (
                  <label key={v} className="flex flex-1 cursor-pointer items-center gap-2.5 rounded-xl border border-line px-4 py-3 has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                    <input type="radio" value={v} className="accent-[var(--color-accent)]" {...register("contactPref")} />
                    {t.contactPrefs[v]}
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}
        <div className="sm:col-span-2">
          <Field label={t.message} id={`${kind}-message`} error={msg("message")}>
            <textarea className="field min-h-36 resize-y" rows={5} placeholder={t.messagePlaceholder} {...fieldProps("message")} {...register("message")} />
          </Field>
        </div>
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink/80">
          <input
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]"
            {...fieldProps("privacy")}
            {...register("privacy")}
          />
          <span>
            {t.privacyA}
            <Link href={`/${locale}/privacy`} className="text-accent underline underline-offset-2" target="_blank">
              {t.privacyLink}
            </Link>
            {t.privacyB}
          </span>
        </label>
        <ErrorText id={`${kind}-privacy-error`} text={msg("privacy")} />
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.div
            ref={focusOnMount}
            tabIndex={-1}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"
          >
            <AlertCircle className="size-5 shrink-0" aria-hidden />
            <div>
              <p className="font-medium">{t.errorTitle}</p>
              <p>{t.errorText}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button type="submit" disabled={isSubmitting} className="btn-primary group mt-8 w-full sm:w-auto disabled:opacity-70">
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden /> {t.submitting}
          </>
        ) : (
          <>
            {t.submit}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}

// Moves focus to the success/error message so screen readers announce it.
const focusOnMount = (el: HTMLDivElement | null) => el?.focus();

function Field({ label, id, error, optional, children }: { label: string; id: string; error?: string; optional?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">({optional})</span>}
      </label>
      {children}
      <ErrorText id={`${id}-error`} text={error} />
    </div>
  );
}

function ErrorText({ id, text }: { id: string; text?: string }) {
  return text ? (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm text-red-800">
      <AlertCircle className="size-3.5" aria-hidden />
      {text}
    </p>
  ) : null;
}
