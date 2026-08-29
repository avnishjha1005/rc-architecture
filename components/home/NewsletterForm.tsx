"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { submitNewsletter, type FormState } from "@/app/actions";
import { PillAction } from "@/components/ui/PillAction";

const initialState: FormState = { status: "idle", message: "" };

export function NewsletterForm({ placeholder, buttonLabel }: { placeholder: string; buttonLabel: string }) {
  const [state, action, pending] = useActionState(submitNewsletter, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const emailId = useId();

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form action={action} ref={formRef}>
      <label className="sr-only" htmlFor={emailId}>Email address</label>
      <input id={emailId} name="email" type="email" autoComplete="email" placeholder={placeholder} maxLength={254} required />
      <label className="form-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <PillAction type="submit" disabled={pending}>{pending ? "Subscribing…" : buttonLabel}</PillAction>
      <p className={`form-status form-status--${state.status}`} aria-live="polite">{state.message}</p>
    </form>
  );
}
