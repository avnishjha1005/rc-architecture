"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContact, type FormState } from "@/app/actions";
import { PillAction } from "@/components/ui/PillAction";

const initialState: FormState = { status: "idle", message: "" };

export function ContactForm({ className, messageClassName }: { className?: string; messageClassName?: string }) {
  const [state, action, pending] = useActionState(submitContact, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form className={className} id="contact-form" action={action} ref={formRef}>
      <label>First name<input name="first-name" autoComplete="given-name" placeholder="Enter first name" maxLength={80} required /></label>
      <label>Last name<input name="last-name" autoComplete="family-name" placeholder="Enter last name" maxLength={80} required /></label>
      <label>Email address<input name="email" type="email" autoComplete="email" placeholder="Enter email address" maxLength={254} required /></label>
      <label>Phone number<input name="phone" type="tel" autoComplete="tel" placeholder="Enter phone number" maxLength={50} /></label>
      <label className={messageClassName}>Message<textarea name="message" placeholder="Enter your message..." maxLength={5000} required /></label>
      <label className="form-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <PillAction type="submit" arrow="diagonal" disabled={pending}>{pending ? "Sending…" : "Send message"}</PillAction>
      <p className={`form-status form-status--${state.status}`} aria-live="polite">{state.message}</p>
    </form>
  );
}
