"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowRight, CheckCircle2, Info, Loader2 } from "lucide-react";
import { contactSchema, quoteSchema, type RequestInput } from "@/lib/schema";
import type { Dictionary, Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  t: Dictionary["form"];
  kind: "contact" | "quote";
  /** Pre-filled values, e.g. when arriving from the savings calculator. */
  defaults?: { property?: string; battery?: string };
};

type Status = "idle" | "success" | "error";

export function RequestForm({ locale, t, kind, defaults = {} }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  // Time of first interaction, used by the server-side spam check.
  const [startedAt, setStartedAt] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequestInput>({
    resolver: zodResolver(kind === "contact" ? contactSchema : quoteSchema),
    defaultValues: { kind, startedAt: 0, property: defaults.property ?? "", bill: "", roof: "", battery: defaults.battery } as Partial<RequestInput>,
    shouldFocusError: true,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await fetch("/api/quote", {
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
        className="card p-8 sm:p-10"
      >
        <CheckCircle2 className="size-10 text-accent" aria-hidden />
        <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight">{t.successTitle}</h3>
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
    <form
      onSubmit={onSubmit}
      onFocusCapture={() => startedAt || setStartedAt(Date.now())}
      noValidate
      className="card p-6 sm:p-10"
    >
      <p className="mb-8 flex items-start gap-2.5 rounded-2xl border border-accent/20 bg-accent-soft px-4 py-3 text-sm text-ink/85">
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
        <Field label={t.email} id={`${kind}-email`} error={msg("email")}>
          <input className="field" type="email" autoComplete="email" inputMode="email" {...fieldProps("email")} {...register("email")} />
        </Field>
        {kind === "quote" && (
          <>
            <Field label={t.phone} id={`${kind}-phone`} error={msg("phone")}>
              <input className="field" type="tel" autoComplete="tel" inputMode="tel" {...fieldProps("phone")} {...register("phone")} />
            </Field>
            <Field label={t.property} id={`${kind}-property`} error={msg("property")}>
              <Select placeholder={t.propertyPlaceholder} options={t.properties} {...fieldProps("property")} {...register("property")} />
            </Field>
            <Field label={t.bill} id={`${kind}-bill`} error={msg("bill")}>
              <Select placeholder={t.billPlaceholder} options={t.bills} {...fieldProps("bill")} {...register("bill")} />
            </Field>
            <Field label={t.location} id={`${kind}-location`} error={msg("location")}>
              <input className="field" autoComplete="address-level2" placeholder={t.locationPlaceholder} {...fieldProps("location")} {...register("location")} />
            </Field>
            <div className="sm:col-span-2">
              <Field label={t.roof} id={`${kind}-roof`} error={msg("roof")}>
                <Select placeholder={t.roofPlaceholder} options={t.roofs} {...fieldProps("roof")} {...register("roof")} />
              </Field>
            </div>
            <fieldset className="sm:col-span-2" aria-describedby={err.battery ? `${kind}-battery-error` : undefined}>
              <legend className="label">{t.battery}</legend>
              <div className="flex flex-wrap gap-2">
                {t.batteryOptions.map((o) => (
                  <label key={o} className="cursor-pointer rounded-full border border-line px-4 py-2.5 text-sm transition-colors hover:border-white/30 has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:checked]:text-accent has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent">
                    <input type="radio" value={o} className="sr-only" {...register("battery")} />
                    {o}
                  </label>
                ))}
              </div>
              <ErrorText id={`${kind}-battery-error`} text={msg("battery")} />
            </fieldset>
          </>
        )}
        <div className="sm:col-span-2">
          <Field label={kind === "quote" ? t.message : t.contactMessage} id={`${kind}-message`} error={msg("message")} optional={kind === "quote" ? t.optional : undefined}>
            <textarea className="field min-h-32 resize-y" rows={4} placeholder={kind === "quote" ? t.messagePlaceholder : t.contactPlaceholder} {...fieldProps("message")} {...register("message")} />
          </Field>
        </div>
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink/85">
          <input type="checkbox" className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]" {...fieldProps("privacy")} {...register("privacy")} />
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
            className="mt-6 flex gap-3 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200"
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
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm text-red-300">
      <AlertCircle className="size-3.5" aria-hidden />
      {text}
    </p>
  ) : null;
}

/** Native select with a disabled placeholder option. */
function Select({ placeholder, options, ...props }: { placeholder: string; options: string[] } & React.ComponentProps<"select">) {
  return (
    <select className="field appearance-none" {...props}>
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
