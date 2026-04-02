"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagramSquare } from "react-icons/fa";

const EXPLORE = [
  { label: "Menu", href: "/menu" },
  { label: "Wine List", href: "/wine" },
  { label: "Reservations", href: "/reservations" },
  { label: "Gift Cards", href: "/gifts" },
];

const COMPANY = [
  { label: "Our Story", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Contact Us", href: "/contact" },
];

const SOCIALS = [
  { icon: <FaInstagramSquare size={16} />, href: "#", label: "Instagram" },
  { icon: <FaFacebook size={16} />, href: "#", label: "Instagram" },
  { icon: <Mail size={16} />, href: "#", label: "Email" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <footer className="bg-stone-100 dark:bg-stone-950 w-full py-12 px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto border-t border-stone-200 dark:border-stone-800 pt-16">
        <div className="flex flex-col gap-6">
          <span className="text-3xl font-serif italic text-teal-900 dark:text-teal-500">
            Savoria
          </span>
          <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
            Crafting unforgettable culinary moments since 1994. From our garden
            to your table.
          </p>
          <div className="flex gap-3">
            {SOCIALS.map(({ icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="w-10 h-10 rounded-full bg-stone-200/70 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:bg-[#01696f] hover:text-white transition-all"
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {[
            { title: "Explore", links: EXPLORE },
            { title: "Company", links: COMPANY },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-xs tracking-widest uppercase text-teal-900 dark:text-teal-500 font-bold mb-6">
                {title}
              </h4>
              <ul className="flex flex-col gap-4">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-stone-500 hover:text-[#01696f] dark:hover:text-teal-400 text-sm transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-xs tracking-widest uppercase text-teal-900 dark:text-teal-500 font-bold">
            Subscribe
          </h4>
          <p className="text-stone-500 text-sm">
            Join the Savoria Editorial list for exclusive tastes.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex items-center border-b border-stone-300 dark:border-stone-700 pb-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="bg-transparent border-none focus:outline-none focus:ring-0 w-full text-sm text-stone-700 dark:text-stone-300 placeholder:text-stone-400"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="text-[#01696f] dark:text-teal-400 hover:translate-x-1 transition-transform ml-2 flex-shrink-0"
            >
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 text-center">
        <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400">
          © 2026 Savoria Editorial. Crafted for the refined palate.
        </p>
      </div>
    </footer>
  );
}
