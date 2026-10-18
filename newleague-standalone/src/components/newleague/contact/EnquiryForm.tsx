'use client';

import { useId, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cx } from '../lib/format';

interface EnquiryValues {
  fullName: string;
  phone: string;
  email: string;
  preferredTeam: string;
  city: string;
  message: string;
  consent: boolean;
}

type FieldName = keyof EnquiryValues;
type Errors = Partial<Record<FieldName, string>>;

const EMPTY: EnquiryValues = {
  fullName: '',
  phone: '',
  email: '',
  preferredTeam: '',
  city: '',
  message: '',
  consent: false,
};

const FIELD_ORDER: FieldName[] = [
  'fullName',
  'phone',
  'email',
  'preferredTeam',
  'city',
  'message',
  'consent',
];

export function validateEnquiry(v: EnquiryValues): Errors {
  const errors: Errors = {};
  const name = v.fullName.trim();
  if (!name) errors.fullName = 'Enter your full name.';
  else if (name.length < 2)
    errors.fullName = 'Name must be at least 2 characters.';

  const phone = v.phone.replace(/[\s()-]/g, '');
  if (!phone)
    errors.phone = 'Enter a phone number so the organisers can call you back.';
  else if (!/^(?:\+?91)?[6-9]\d{9}$/.test(phone))
    errors.phone = 'Enter a 10-digit Indian mobile number, e.g. 98765 43210.';

  const email = v.email.trim();
  if (!email) errors.email = 'Enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    errors.email = 'Enter an email address like name@example.com.';

  if (v.preferredTeam.trim().length > 60)
    errors.preferredTeam = 'Keep the team name under 60 characters.';

  if (!v.city.trim()) errors.city = 'Enter your city or area.';

  if (v.message.trim().length > 1000)
    errors.message = 'Keep your message under 1,000 characters.';

  if (!v.consent)
    errors.consent =
      'Tick the box so the organisers may contact you about this enquiry.';
  return errors;
}

/**
 * BACKEND INTEGRATION POINT
 * There is no verified enquiry endpoint in this application, so the form
 * stops at a frontend-only demonstration. When an API exists, replace this
 * function with a real request (e.g. using the portal's existing axios
 * services) and only show the "sent" confirmation after it succeeds.
 */
async function submitEnquiryDemo(values: EnquiryValues): Promise<void> {
  void values;
  await new Promise((resolve) => setTimeout(resolve, 600));
}

const inputClass =
  'mt-2 block w-full border bg-[#061426] px-3.5 py-3 text-base text-white placeholder:text-[#AAB8CA]/60 focus:ring-0';

export default function EnquiryForm() {
  const [values, setValues] = useState<EnquiryValues>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {}
  );
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');
  const [submittedName, setSubmittedName] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const fid = (name: FieldName) => `${uid}-${name}`;

  const update = <K extends FieldName>(name: K, value: EnquiryValues[K]) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name])
      setErrors((prev) => ({ ...prev, [name]: validateEnquiry(next)[name] }));
  };

  const blur = (name: FieldName) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateEnquiry(values)[name] }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateEnquiry(values);
    setErrors(found);
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) {
      summaryRef.current?.focus();
      return;
    }
    setStatus('submitting');
    await submitEnquiryDemo(values);
    setSubmittedName(values.fullName.trim().split(/\s+/)[0] ?? '');
    setStatus('done');
    requestAnimationFrame(() => successRef.current?.focus());
  };

  const startOver = () => {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setStatus('idle');
  };

  const errorList = FIELD_ORDER.filter((f) => errors[f]);

  if (status === 'done') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border border-[#F5C65D]/50 bg-[#F5C65D]/[0.06] p-6 focus:outline-none md:p-8"
      >
        <CheckCircle2 className="h-8 w-8 text-[#F5C65D]" aria-hidden="true" />
        <h3 className="mt-4 text-4xl font-black">
          Enquiry checked{submittedName ? `, ${submittedName}` : ''}
        </h3>
        <p className="mt-3 leading-relaxed text-[#AAB8CA]">
          Your details passed every check. This page is a preview, so the
          enquiry has <strong className="text-white">not</strong> been sent to
          the organisers yet. To talk about a franchise today, call one of the
          organisers listed on this page.
        </p>
        <button
          type="button"
          onClick={startOver}
          className="nl-btn nl-btn--line nl-btn--sm mt-6"
        >
          Start a new enquiry
        </button>
      </div>
    );
  }

  const fieldError = (name: FieldName) =>
    errors[name] ? (
      <p id={`${fid(name)}-error`} className="mt-2 text-sm text-[#FF9A9A]">
        {errors[name]}
      </p>
    ) : null;

  const describedBy = (name: FieldName, hint?: boolean) =>
    [
      hint ? `${fid(name)}-hint` : null,
      errors[name] ? `${fid(name)}-error` : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  const border = (name: FieldName) =>
    errors[name]
      ? 'border-[#FF7A7A]'
      : 'border-white/15 focus:border-[#F5C65D]';

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-describedby={`${uid}-note`}
    >
      <div
        ref={summaryRef}
        tabIndex={-1}
        className={cx(
          'focus:outline-none',
          errorList.length > 0
            ? 'mb-6 border border-[#FF7A7A]/60 bg-[#FF7A7A]/[0.07] p-4'
            : 'sr-only'
        )}
        aria-live="assertive"
      >
        {errorList.length > 0 && (
          <>
            <p className="font-semibold">
              {errorList.length === 1
                ? 'Fix 1 field to continue:'
                : `Fix ${errorList.length} fields to continue:`}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {errorList.map((f) => (
                <li key={f}>
                  <a href={`#${fid(f)}`} className="underline">
                    {errors[f]}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={fid('fullName')} className="text-sm font-semibold">
            Full name
          </label>
          <input
            id={fid('fullName')}
            name="fullName"
            autoComplete="name"
            value={values.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            onBlur={() => blur('fullName')}
            aria-invalid={!!errors.fullName}
            aria-describedby={describedBy('fullName')}
            className={cx(inputClass, border('fullName'))}
          />
          {fieldError('fullName')}
        </div>

        <div>
          <label htmlFor={fid('phone')} className="text-sm font-semibold">
            Phone number
          </label>
          <input
            id={fid('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
            onBlur={() => blur('phone')}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy('phone')}
            className={cx(inputClass, border('phone'))}
          />
          {fieldError('phone')}
        </div>

        <div>
          <label htmlFor={fid('email')} className="text-sm font-semibold">
            Email
          </label>
          <input
            id={fid('email')}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            onBlur={() => blur('email')}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy('email')}
            className={cx(inputClass, border('email'))}
          />
          {fieldError('email')}
        </div>

        <div>
          <label
            htmlFor={fid('preferredTeam')}
            className="text-sm font-semibold"
          >
            Preferred franchise or team name{' '}
            <span className="font-normal text-[#AAB8CA]">(optional)</span>
          </label>
          <input
            id={fid('preferredTeam')}
            name="preferredTeam"
            value={values.preferredTeam}
            onChange={(e) => update('preferredTeam', e.target.value)}
            onBlur={() => blur('preferredTeam')}
            aria-invalid={!!errors.preferredTeam}
            aria-describedby={describedBy('preferredTeam')}
            className={cx(inputClass, border('preferredTeam'))}
          />
          {fieldError('preferredTeam')}
        </div>

        <div>
          <label htmlFor={fid('city')} className="text-sm font-semibold">
            City or area
          </label>
          <input
            id={fid('city')}
            name="city"
            autoComplete="address-level2"
            value={values.city}
            onChange={(e) => update('city', e.target.value)}
            onBlur={() => blur('city')}
            aria-invalid={!!errors.city}
            aria-describedby={describedBy('city')}
            className={cx(inputClass, border('city'))}
          />
          {fieldError('city')}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={fid('message')} className="text-sm font-semibold">
            Message{' '}
            <span className="font-normal text-[#AAB8CA]">(optional)</span>
          </label>
          <p
            id={`${fid('message')}-hint`}
            className="mt-1 text-xs text-[#AAB8CA]"
          >
            Tell the organisers what you&apos;d like to know about owning a
            team.
          </p>
          <textarea
            id={fid('message')}
            name="message"
            rows={5}
            value={values.message}
            onChange={(e) => update('message', e.target.value)}
            onBlur={() => blur('message')}
            aria-invalid={!!errors.message}
            aria-describedby={describedBy('message', true)}
            className={cx(inputClass, 'resize-y', border('message'))}
          />
          {fieldError('message')}
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-start gap-3">
            <input
              id={fid('consent')}
              name="consent"
              type="checkbox"
              checked={values.consent}
              onChange={(e) => update('consent', e.target.checked)}
              onBlur={() => blur('consent')}
              aria-invalid={!!errors.consent}
              aria-describedby={describedBy('consent')}
              className="mt-0.5 h-5 w-5 shrink-0 rounded-none border-white/40 bg-transparent text-[#F5C65D] focus:ring-[#F5C65D] focus:ring-offset-0"
            />
            <label
              htmlFor={fid('consent')}
              className="text-sm leading-relaxed text-[#AAB8CA]"
            >
              I agree that the league organisers may contact me by phone or
              email about this franchise enquiry.
            </label>
          </div>
          {fieldError('consent')}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="nl-btn nl-btn--gold disabled:opacity-70"
        >
          {status === 'submitting' ? 'Checking details…' : 'Submit enquiry'}
        </button>
        <p
          id={`${uid}-note`}
          className="text-xs leading-relaxed text-[#AAB8CA]"
        >
          Preview form: details are checked in your browser and are not sent
          anywhere yet.
        </p>
      </div>
    </form>
  );
}
