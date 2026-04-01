"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Globe, Eye, EyeOff } from "lucide-react";
import { useCommonMutationApi } from "@/api-hooks/use-api-mutation";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/actions/auth";
import { sileo } from "sileo";
import { Spinner } from "@/components/ui/spinner";

interface SignInForm {
  email: string;
  password: string;
}
const RESTAURANT_IMAGE =
  "https://images.unsplash.com/photo-1659626890153-7421275f4b74?q=80&w=729&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
export default function SignInPage() {
  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: () => loginUser(form.email, form.password),
    onSuccess: (data) => {
      if (data?.data) {
        sileo.success({
          title: "Login successful",
          description: "",
          duration: 2000,
          fill: "#e6f4f3",
        });
        return;
      }
      sileo.error({
        title: "Error",
        description: data?.error?.message || "Unknown error",
        duration: 2000,
        fill: "#e6f4f3",
      });
    },
  });
  const [form, setForm] = useState<SignInForm>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    mutate();
    console.log("Form submitted:", form);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#faf9f5] dark:bg-stone-950">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-xl shadow-[0_8px_40px_rgba(40,37,29,0.08)] overflow-hidden bg-white dark:bg-stone-900">
        {/* ── Visual Side ── */}
        <div className="hidden lg:block relative min-h-[600px]">
          <Image
            src={RESTAURANT_IMAGE}
            alt="Intimate candlelit restaurant setting"
            width={700}
            height={1700}
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-[#01696f]/25" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <p className="font-serif text-3xl italic mb-4 leading-tight">
              &ldquo;The table is a meeting place, a ground of commonality, the
              instrument of an ensemble.&rdquo;
            </p>
            <p className="uppercase tracking-widest text-xs opacity-75">
              — Savoria Editorial
            </p>
          </div>
        </div>

        {/* ── Form Side ── */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Brand + Heading */}
            <header className="mb-10">
              <p className="font-serif italic text-2xl text-[#01696f] dark:text-[#01a7b1] mb-6">
                Savoria
              </p>
              <h1 className="font-serif text-5xl lg:text-6xl text-[#01696f] dark:text-[#01a7b1] italic tracking-tight mb-3">
                Welcome Back
              </h1>
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                Continue your culinary journey with us.
              </p>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-widest text-stone-500 font-bold ml-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 rounded-lg bg-stone-100 dark:bg-stone-800 border-none
                             focus:outline-none focus:ring-2 focus:ring-[#01696f]/30
                             text-stone-800 dark:text-stone-100 placeholder:text-stone-400 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label
                    htmlFor="password"
                    className="block text-xs uppercase tracking-widest text-stone-500 font-bold"
                  >
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-xs text-[#01696f] dark:text-[#01a7b1] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 pr-12 rounded-lg bg-stone-100 dark:bg-stone-800 border-none
                               focus:outline-none focus:ring-2 focus:ring-[#01696f]/30
                               text-stone-800 dark:text-stone-100 placeholder:text-stone-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-br from-[#01696f] to-[#014d52]
                           text-white font-semibold rounded-full shadow-lg
                           hover:shadow-xl active:scale-95 transition-all duration-200"
              >
                {isPending ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200 dark:border-stone-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-white dark:bg-stone-900 px-4 text-stone-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-3 py-3 px-4
                           bg-stone-100 dark:bg-stone-800 rounded-full
                           hover:bg-stone-200 dark:hover:bg-stone-700
                           active:scale-95 transition-all duration-200"
              >
                <Globe
                  size={20}
                  className="text-[#01696f] dark:text-[#01a7b1]"
                />
                <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
                  Google
                </span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-3 py-3 px-4
                           bg-stone-100 dark:bg-stone-800 rounded-full
                           hover:bg-stone-200 dark:hover:bg-stone-700
                           active:scale-95 transition-all duration-200"
              >
                <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
                  Facebook
                </span>
              </button>
            </div>

            {/* Footer Link */}
            <footer className="mt-12 text-center">
              <p className="text-stone-500 dark:text-stone-400 text-sm">
                New to Savoria?{" "}
                <Link
                  href="/sign-up"
                  className="text-[#01696f] dark:text-[#01a7b1] font-semibold hover:underline ml-1"
                >
                  Create an account
                </Link>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
