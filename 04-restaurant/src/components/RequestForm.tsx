"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowRight, CheckCircle2, Info, Loader2 } from "lucide-react";
import { bookingSchema, contactSchema, type RequestInput } from "@/lib/schema";
import type { Dictionary, Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  t: Dictionary["form"];
  kind: "contact" | "booking";
  /** Placeholder for the message field (contact forms are also used for event enquiries). */
  placeholder?: string;
};

type Status = "idle" | "success" | "error";

const GUESTS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export function RequestForm({ locale, t, kind, placeholder }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  // Time of first interaction, used by the server-side spam check.
  const [startedAt, setStartedAt] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequestInput>({
    resolver: zodResolver(kind === "contact" ? contactSchema : bookingSchema),
    defaultValues: { kind, startedAt: 0, time: "", guests: "", area: "" } as Partial<RequestInput>,
    shouldFocusError: true,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await fetch("/api/booking", {
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
      <motion.div ref={focusOnMount} tabIndex={-1} role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="border border-line bg-surface p-8 sm:p-10">
        <CheckCircle2 className="size-10 text-amber" aria-hidden />
        <h3 className="mt-6 font-display text-3xl">{t.successTitle}</h3>
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
    <form onSubmit={onSubmit} onFocusCapture={() => startedAt || setStartedAt(Date.now())} noValidate className="border border-line bg-surface p-6 sm:p-10">
      <p className="mb-8 flex items-start gap-2.5 border-l-2 border-sun bg-mist px-4 py-3 text-sm text-ink/85">
        <Info className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
        {t.demoNotice}
      </p>

      <input type="hidden" {...register("kind")} />
      {/* Honeypot: visually hidden, skipped by keyboard and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${kind}-website`}>{t.honeypot}</label>
        <input id={`${kind}-website`} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {kind === "booking" && (
          <>
            <Field label={t.date} id={`${kind}-date`} error={msg("date")}>
              <input
                className="field"
                type="date"
                lang={locale}
                onFocus={(e) => (e.currentTarget.min = new Date().toISOString().slice(0, 10))}
                {...fieldProps("date")}
                {...register("date")}
              />
            </Field>
            <Field label={t.time} id={`${kind}-time`} error={msg("time")}>
              <select className="field appearance-none" {...fieldProps("time")} {...register("time")}>
                <option value="" disabled>{t.timePlaceholder}</option>
                <optgroup label={t.lunch}>{t.lunchSlots.map((s) => <option key={s} value={s}>{s}</option>)}</optgroup>
                <optgroup label={t.dinner}>{t.dinnerSlots.map((s) => <option key={s} value={s}>{s}</option>)}</optgroup>
              </select>
            </Field>
            <Field label={t.guests} id={`${kind}-guests`} error={msg("guests")} hint={t.guestsHint}>
              <select className="field appearance-none" {...fieldProps("guests")} {...register("guests")}>
                <option value="" disabled>{t.guestsPlaceholder}</option>
                {GUESTS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <fieldset aria-describedby={err.area ? `${kind}-area-error` : undefined}>
              <legend className="label">{t.area}</legend>
              <div className="flex flex-wrap gap-2">
                {t.areas.map((a) => (
                  <label key={a} className="cursor-pointer border border-line bg-mist px-3.5 py-2.5 text-sm transition-colors hover:border-ink/40 has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-mist has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink">
                    <input type="radio" value={a} className="sr-only" {...register("area")} />
                    {a}
                  </label>
                ))}
              </div>
              <ErrorText id={`${kind}-area-error`} text={msg("area")} />
            </fieldset>
          </>
        )}
        <Field label={t.name} id={`${kind}-name`} error={msg("name")}>
          <input className="field" autoComplete="name" {...fieldProps("name")} {...register("name")} />
        </Field>
        <Field label={t.email} id={`${kind}-email`} error={msg("email")}>
          <input className="field" type="email" autoComplete="email" inputMode="email" {...fieldProps("email")} {...register("email")} />
        </Field>
        {kind === "booking" && (
          <Field label={t.phone} id={`${kind}-phone`} error={msg("phone")}>
            <input className="field" type="tel" autoComplete="tel" inputMode="tel" {...fieldProps("phone")} {...register("phone")} />
          </Field>
        )}
        <div className="sm:col-span-2">
          <Field label={kind === "booking" ? t.message : t.contactMessage} id={`${kind}-message`} error={msg("message")} optional={kind === "booking" ? t.optional : undefined}>
            <textarea
              className="field min-h-28 resize-y"
              rows={3}
              placeholder={kind === "booking" ? t.messagePlaceholder : (placeholder ?? t.contactPlaceholder)}
              {...fieldProps("message")}
              {...register("message")}
            />
          </Field>
        </div>
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink/85">
          <input type="checkbox" className="mt-1 size-4 shrink-0 accent-[var(--color-ink)]" {...fieldProps("privacy")} {...register("privacy")} />
          <span>
            {t.privacyA}
            <Link href={`/${locale}/privacy`} className="underline underline-offset-2" target="_blank">
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
            className="mt-6 flex gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-900"
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

function Field({ label, id, error, optional, hint, children }: { label: string; id: string; error?: string; optional?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">({optional})</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-2 text-xs text-muted">{hint}</p>}
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
