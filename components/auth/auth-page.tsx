"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

import { LegalDialog } from "@/components/auth/legal-dialog";
import { Field, TextInput } from "@/components/dashboard/form-controls";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { todayISODate } from "@/lib/incidents";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

type LoginErrors = Partial<Record<"identifier" | "password", string>>;

type SignupErrors = Partial<
  Record<"email" | "dob" | "username" | "password" | "confirmPassword" | "terms", string>
>;

type SignupDraft = {
  email: string;
  dob: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const EMPTY_SIGNUP: SignupDraft = {
  email: "",
  dob: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,24}$/;

function calculateAge(date: string): number | null {
  if (!date) return null;
  const birth = new Date(`${date}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const month = today.getMonth() - birth.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
}

export function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});

  const [signup, setSignup] = useState<SignupDraft>(EMPTY_SIGNUP);
  const [signupErrors, setSignupErrors] = useState<SignupErrors>({});
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const loginTabRef = useRef<HTMLButtonElement>(null);
  const signupTabRef = useRef<HTMLButtonElement>(null);
  const redirectTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) window.clearTimeout(redirectTimer.current);
    };
  }, []);

  const age = calculateAge(signup.dob);
  const dobHint =
    age !== null && age >= 0
      ? `Calculated age: ${age}.`
      : "Used only to calculate your age.";

  function activateTab(next: Mode) {
    setMode(next);
    setLoginErrors({});
    setSignupErrors({});
    setNotice("");
    setSubmitting(false);
    if (redirectTimer.current) window.clearTimeout(redirectTimer.current);
    window.requestAnimationFrame(() => {
      if (next === "login") loginTabRef.current?.focus();
      else signupTabRef.current?.focus();
    });
  }

  function handleTabKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      activateTab(mode === "login" ? "signup" : "login");
    } else if (event.key === "Home") {
      event.preventDefault();
      activateTab("login");
    } else if (event.key === "End") {
      event.preventDefault();
      activateTab("signup");
    }
  }

  function updateSignup<K extends keyof SignupDraft>(key: K, value: string) {
    setSignup((current) => ({ ...current, [key]: value }));
    setSignupErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors: LoginErrors = {};
    if (!identifier.trim()) errors.identifier = "Enter your email or username.";
    if (!loginPassword) errors.password = "Enter your password.";

    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setNotice("Signed in. Opening your dashboard...");
    redirectTimer.current = window.setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  }

  function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors: SignupErrors = {};
    const email = signup.email.trim();
    const username = signup.username.trim();

    if (!email) errors.email = "Enter your email address.";
    else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";

    if (!signup.dob) {
      errors.dob = "Enter your date of birth.";
    } else if (signup.dob > todayISODate()) {
      errors.dob = "Date of birth cannot be in the future.";
    } else if (age === null || age < 13) {
      errors.dob = "You must be at least 13 years old.";
    } else if (age > 120) {
      errors.dob = "Enter a realistic date of birth.";
    }

    if (!username) errors.username = "Choose a username.";
    else if (!USERNAME_PATTERN.test(username)) {
      errors.username = "Use 3–24 letters, numbers, or underscores.";
    }

    if (signup.password.length < 8) {
      errors.password = "Use at least 8 characters.";
    }
    if (!signup.confirmPassword) {
      errors.confirmPassword = "Confirm your password.";
    } else if (signup.password !== signup.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!termsAccepted) {
      errors.terms = "Open the terms and confirm that you have read them.";
    }

    setSignupErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setNotice(`Account created for ${email}. Sign in to continue.`);
    setMode("login");
    setIdentifier(email);
    setLoginPassword("");
    setSignup(EMPTY_SIGNUP);
    setTermsAccepted(false);
    setShowSignupPassword(false);
    setShowConfirmPassword(false);
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLInputElement>("#login-password")?.focus();
    });
  }

  const describedBy = (id: string, hasError: boolean, hint = false) =>
    hasError ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link
          href="/"
          aria-label="RCA Tracking System home"
          className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          <Logo className="gap-2.5" markClassName="size-9" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Back to home
        </Link>
      </header>

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto grid w-full max-w-[1100px] gap-10 px-5 pt-4 pb-16 sm:px-8 lg:min-h-[calc(100dvh-5.5rem)] lg:grid-cols-[minmax(0,1fr)_27rem] lg:items-center lg:gap-16 lg:py-12"
      >
        <section aria-labelledby="auth-intro-title" className="hidden lg:block">
          <p className="flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            <span aria-hidden="true" className="h-px w-7 bg-primary" />
            Account access
          </p>
          <h2
            id="auth-intro-title"
            className="mt-5 max-w-[13ch] font-heading text-[2.9rem] leading-[1.03] font-bold tracking-[-0.035em] text-foreground"
          >
            A clear record starts with the right access.
          </h2>
          <p className="mt-5 max-w-[46ch] text-[0.98rem] leading-7 text-muted-foreground">
            Sign in to capture incidents, connect evidence to root causes, and
            keep prevention work visible from the first report to the final
            correction.
          </p>
          <ul className="mt-8 space-y-3.5">
            {[
              "Cause-first incident records",
              "Evidence and preventive actions in one place",
              "Pending and resolved views for every team",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-foreground/90">
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border bg-muted/50">
                  <Check aria-hidden="true" className="size-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="auth-title"
          className="w-full rounded-2xl border border-border bg-card p-5 shadow-lift sm:p-6"
        >
          <div className="mb-5">
            <p className="text-[0.66rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {mode === "login" ? "Welcome back" : "Get started"}
            </p>
            <h1
              id="auth-title"
              className="mt-2 font-heading text-[1.7rem] leading-tight font-bold tracking-[-0.03em] text-foreground"
            >
              {mode === "login" ? "Sign in to your workspace" : "Create your account"}
            </h1>
            <p className="mt-2 text-[0.83rem] leading-6 text-muted-foreground">
              {mode === "login"
                ? "Use your email or username and password to continue."
                : "Set up an account to record and review incidents."}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Account access"
            onKeyDown={handleTabKeys}
            className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/35 p-1"
          >
            <button
              ref={loginTabRef}
              id="login-tab"
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              aria-controls="login-panel"
              tabIndex={mode === "login" ? 0 : -1}
              onClick={() => activateTab("login")}
              className={cn(
                "h-8 rounded-md text-[0.8rem] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none",
                mode === "login"
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Log in
            </button>
            <button
              ref={signupTabRef}
              id="signup-tab"
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              aria-controls="signup-panel"
              tabIndex={mode === "signup" ? 0 : -1}
              onClick={() => activateTab("signup")}
              className={cn(
                "h-8 rounded-md text-[0.8rem] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none",
                mode === "signup"
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Sign up
            </button>
          </div>

          {notice ? (
            <p
              role="status"
              className="mt-4 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-[0.8rem] leading-5 text-foreground"
            >
              {notice}
            </p>
          ) : null}

          {mode === "login" ? (
            <div
              id="login-panel"
              role="tabpanel"
              aria-labelledby="login-tab"
              className="mt-5"
            >
              <form noValidate onSubmit={handleLogin} className="space-y-4">
                <Field
                  id="login-identifier"
                  label="Email or username"
                  required
                  error={loginErrors.identifier}
                >
                  <TextInput
                    id="login-identifier"
                    name="identifier"
                    autoComplete="username"
                    value={identifier}
                    onChange={(event) => {
                      setIdentifier(event.target.value);
                      setLoginErrors((current) => {
                        if (!current.identifier) return current;
                        const next = { ...current };
                        delete next.identifier;
                        return next;
                      });
                    }}
                    placeholder="you@example.com"
                    invalid={Boolean(loginErrors.identifier)}
                    aria-describedby={describedBy(
                      "login-identifier",
                      Boolean(loginErrors.identifier),
                    )}
                  />
                </Field>

                <Field
                  id="login-password"
                  label="Password"
                  required
                  error={loginErrors.password}
                >
                  <div className="relative">
                    <TextInput
                      id="login-password"
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(event) => {
                        setLoginPassword(event.target.value);
                        setLoginErrors((current) => {
                          if (!current.password) return current;
                          const next = { ...current };
                          delete next.password;
                          return next;
                        });
                      }}
                      placeholder="Enter your password"
                      className="pr-10"
                      invalid={Boolean(loginErrors.password)}
                      aria-describedby={describedBy(
                        "login-password",
                        Boolean(loginErrors.password),
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((current) => !current)}
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                      className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
                    >
                      {showLoginPassword ? (
                        <EyeOff aria-hidden="true" className="size-4" />
                      ) : (
                        <Eye aria-hidden="true" className="size-4" />
                      )}
                    </button>
                  </div>
                </Field>

                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "mt-1 h-10 w-full gap-2 text-sm disabled:opacity-70",
                  )}
                >
                  {submitting ? "Signing in..." : "Sign in"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </button>
              </form>
            </div>
          ) : (
            <div
              id="signup-panel"
              role="tabpanel"
              aria-labelledby="signup-tab"
              className="mt-5"
            >
              <form noValidate onSubmit={handleSignup} className="space-y-4">
                <Field
                  id="signup-email"
                  label="Email"
                  required
                  error={signupErrors.email}
                >
                  <TextInput
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={signup.email}
                    onChange={(event) => updateSignup("email", event.target.value)}
                    placeholder="you@example.com"
                    invalid={Boolean(signupErrors.email)}
                    aria-describedby={describedBy("signup-email", Boolean(signupErrors.email))}
                  />
                </Field>

                <Field
                  id="signup-dob"
                  label="Date of birth"
                  required
                  error={signupErrors.dob}
                  hint={dobHint}
                >
                  <TextInput
                    id="signup-dob"
                    name="dob"
                    type="date"
                    autoComplete="bday"
                    max={todayISODate()}
                    value={signup.dob}
                    onChange={(event) => updateSignup("dob", event.target.value)}
                    invalid={Boolean(signupErrors.dob)}
                    aria-describedby={describedBy(
                      "signup-dob",
                      Boolean(signupErrors.dob),
                      true,
                    )}
                  />
                </Field>

                <Field
                  id="signup-username"
                  label="Username"
                  required
                  error={signupErrors.username}
                >
                  <TextInput
                    id="signup-username"
                    name="username"
                    autoComplete="username"
                    value={signup.username}
                    onChange={(event) => updateSignup("username", event.target.value)}
                    placeholder="incident_lead"
                    invalid={Boolean(signupErrors.username)}
                    aria-describedby={describedBy(
                      "signup-username",
                      Boolean(signupErrors.username),
                    )}
                  />
                </Field>

                <Field
                  id="signup-password"
                  label="Password"
                  required
                  error={signupErrors.password}
                  hint="Use at least 8 characters."
                >
                  <div className="relative">
                    <TextInput
                      id="signup-password"
                      name="password"
                      type={showSignupPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={signup.password}
                      onChange={(event) => updateSignup("password", event.target.value)}
                      placeholder="Create a password"
                      className="pr-10"
                      invalid={Boolean(signupErrors.password)}
                      aria-describedby={describedBy(
                        "signup-password",
                        Boolean(signupErrors.password),
                        true,
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword((current) => !current)}
                      aria-label={showSignupPassword ? "Hide password" : "Show password"}
                      className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
                    >
                      {showSignupPassword ? (
                        <EyeOff aria-hidden="true" className="size-4" />
                      ) : (
                        <Eye aria-hidden="true" className="size-4" />
                      )}
                    </button>
                  </div>
                </Field>

                <Field
                  id="signup-confirm-password"
                  label="Confirm password"
                  required
                  error={signupErrors.confirmPassword}
                >
                  <div className="relative">
                    <TextInput
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={signup.confirmPassword}
                      onChange={(event) =>
                        updateSignup("confirmPassword", event.target.value)
                      }
                      placeholder="Repeat your password"
                      className="pr-10"
                      invalid={Boolean(signupErrors.confirmPassword)}
                      aria-describedby={describedBy(
                        "signup-confirm-password",
                        Boolean(signupErrors.confirmPassword),
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      aria-label={
                        showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"
                      }
                      className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff aria-hidden="true" className="size-4" />
                      ) : (
                        <Eye aria-hidden="true" className="size-4" />
                      )}
                    </button>
                  </div>
                </Field>

                <div>
                  <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                    <input
                      id="signup-terms"
                      name="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={() => {
                        if (termsAccepted) setTermsAccepted(false);
                        else setTermsOpen(true);
                      }}
                      aria-invalid={Boolean(signupErrors.terms) || undefined}
                      aria-describedby={
                        signupErrors.terms ? "signup-terms-error" : undefined
                      }
                      className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-input accent-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
                    />
                    <label
                      htmlFor="signup-terms"
                      className="cursor-pointer text-[0.78rem] leading-5 text-muted-foreground"
                    >
                      I agree to the Terms &amp; Conditions and Privacy Policy.
                      Selecting this opens both documents.
                    </label>
                  </div>
                  {signupErrors.terms ? (
                    <p
                      id="signup-terms-error"
                      role="alert"
                      className="mt-1.5 text-xs text-destructive"
                    >
                      {signupErrors.terms}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "mt-1 h-10 w-full gap-2 text-sm",
                  )}
                >
                  Create account
                  <ArrowRight aria-hidden="true" className="size-4" />
                </button>
              </form>
            </div>
          )}

          <p className="mt-5 border-t border-border pt-4 text-center text-[0.7rem] leading-5 text-muted-foreground">
            Prototype only. Accounts and incident records are kept in memory and
            are not saved.
          </p>
        </section>
      </main>

      {termsOpen ? (
        <LegalDialog
          onClose={() => setTermsOpen(false)}
          onAgree={() => {
            setTermsAccepted(true);
            setTermsOpen(false);
            setSignupErrors((current) => {
              if (!current.terms) return current;
              const next = { ...current };
              delete next.terms;
              return next;
            });
          }}
        />
      ) : null}
    </div>
  );
}
