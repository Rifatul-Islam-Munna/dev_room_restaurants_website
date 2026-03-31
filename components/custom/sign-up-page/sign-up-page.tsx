"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useCommonMutationApi } from "@/api-hooks/use-api-mutation";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

interface SignUpForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  newsletter: boolean;
}

const RESTAURANT_IMAGE =
  "https://images.unsplash.com/photo-1697350671122-4ffda28f5a85?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function SignUpPage() {
  const [form, setForm] = useState<SignUpForm>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    newsletter: false,
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useCommonMutationApi({
    method: "POST",
    url: "/user/register",
    successMessage: "Registered Successfully",
    onSuccess: () => router.push("/login"),
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { newsletter, ...rest } = form;
    const payload = {
      phoneNumber: rest.phone,
      email: rest.email,
      fullName: rest.fullName,
      password: rest.password,
    };
    mutate(payload);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 md:py-20 bg-[#faf9f5] dark:bg-stone-950">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* ── Visual Side ── */}
        <div className="hidden lg:block relative">
          <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl relative">
            <Image
              src={RESTAURANT_IMAGE}
              alt="Elegant dining table set with white linen, crystal glasses, and a flickering candle"
              fill
              sizes="(max-width: 1024px) 0vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#01696f]/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="font-serif italic text-3xl leading-tight">
                &ldquo;A seat at our table is an invitation to slow down and
                savor the artistry of the moment.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* ── Form Side ── */}
        <div className="w-full max-w-md mx-auto space-y-10">
          {/* Heading */}
          <header className="space-y-3">
            <p className="font-serif italic text-2xl text-[#01696f] dark:text-[#01a7b1]">
              Savoria
            </p>
            <h1 className="font-serif italic text-5xl md:text-6xl text-[#01696f] dark:text-[#01a7b1] leading-none tracking-tight">
              Join the Table
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-lg">
              Enter your details to begin your culinary journey with us.
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-xs font-bold uppercase tracking-widest text-[#01696f] dark:text-[#01a7b1] ml-1"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Alexander Savor"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 rounded-lg bg-stone-100 dark:bg-stone-800
                           focus:outline-none focus:ring-2 focus:ring-[#01696f]/30
                           text-stone-800 dark:text-stone-100 placeholder:text-stone-400 transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-widest text-[#01696f] dark:text-[#01a7b1] ml-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="alex@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 rounded-lg bg-stone-100 dark:bg-stone-800
                           focus:outline-none focus:ring-2 focus:ring-[#01696f]/30
                           text-stone-800 dark:text-stone-100 placeholder:text-stone-400 transition-all"
              />
            </div>

            {/* Phone & Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-xs font-bold uppercase tracking-widest text-[#01696f] dark:text-[#01a7b1] ml-1"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-lg bg-stone-100 dark:bg-stone-800
                             focus:outline-none focus:ring-2 focus:ring-[#01696f]/30
                             text-stone-800 dark:text-stone-100 placeholder:text-stone-400 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-widest text-[#01696f] dark:text-[#01a7b1] ml-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 pr-12 rounded-lg bg-stone-100 dark:bg-stone-800
                               focus:outline-none focus:ring-2 focus:ring-[#01696f]/30
                               text-stone-800 dark:text-stone-100 placeholder:text-stone-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400
                               hover:text-stone-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Newsletter Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="newsletter"
                  name="newsletter"
                  type="checkbox"
                  checked={form.newsletter}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-stone-300 text-[#01696f]
                             focus:ring-[#01696f] cursor-pointer accent-[#01696f]"
                />
              </div>
              <div className="text-sm">
                <label
                  htmlFor="newsletter"
                  className="font-medium text-stone-800 dark:text-stone-200 cursor-pointer"
                >
                  Receive curated menus and event invites
                </label>
                <p className="text-stone-500 dark:text-stone-400 text-xs mt-0.5">
                  Our monthly editorial on seasonal flavors and exclusive cellar
                  releases.
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 px-8 rounded-full bg-gradient-to-br from-[#01696f] to-[#014d52]
                           text-white font-bold tracking-widest uppercase text-sm shadow-xl
                           hover:opacity-90 active:scale-[0.98] transition-all duration-200"
              >
                {isPending ? `Creating Account ...` : "Create Account"}
              </button>
            </div>

            {/* Terms & Sign In link */}
            <div className="text-center space-y-4">
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed px-4">
                By signing up, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-2 hover:text-[#01696f] transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-2 hover:text-[#01696f] transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </p>
              <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-[#01696f] dark:text-[#01a7b1] font-bold hover:underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
