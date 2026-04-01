"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Phone, ArrowRight } from "lucide-react";
import DishCard from "@/components/custom/common/dish-card";
import { useState } from "react";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";
import {
  ApiListResponse,
  MenuItem,
} from "@/components/custom/admin/menu/MenuItemsPage";
import { useRouter } from "next/navigation";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1565895405137-3ca0cc5088c8?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const INFO_CARDS = [
  {
    icon: <Clock size={22} className="text-[#01696f]" />,
    title: "Open Daily",
    body: "11:00 AM — 10:00 PM",
    extra: "",
  },
  {
    icon: <MapPin size={22} className="text-[#01696f]" />,
    title: "Visit Us",
    body: "123 Flavor Street, Dhaka",
    extra: "md:border-x md:border-stone-200 dark:md:border-stone-700 md:px-12",
  },
  {
    icon: <Phone size={22} className="text-[#01696f]" />,
    title: "Reservations",
    body: "+880 1700-000000",
    extra: "",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Browse Menu",
    body: "Explore our curated selection of seasonal dishes and artisan beverages.",
  },
  {
    num: "02",
    title: "Add to Cart",
    body: "Select your favorites and customize your order to your specific preferences.",
  },
  {
    num: "03",
    title: "Place Order",
    body: "Confirm your order and relax as our chefs prepare your gourmet experience.",
  },
];

/* ── Component ───────────────────────────────────────────── */

export default function HomePage() {
  const [cart, setCart] = useState({ count: 0, total: 0 });
  const handleCartChange = (name: string, delta: number, priceNum: number) => {
    setCart((prev) => ({
      count: Math.max(0, prev.count + delta),
      total: Math.max(0, prev.total + priceNum * delta),
    }));
  };
  const router = useRouter();
  const { data: menuRes, isLoading } = useQueryWrapper<
    ApiListResponse<MenuItem[]>
  >(["menu-items"], `/menu-item?limit=4&page=1`);

  return (
    <>
      <section className="relative min-h-screen w-full flex items-center pt-20 overflow-hidden bg-[#faf9f5] dark:bg-stone-950">
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 z-10 py-12">
            <span className="text-[#01696f] text-xs tracking-[0.3em] uppercase mb-6 block font-bold">
              Established 1994
            </span>
            <h1 className="text-6xl md:text-[5.5rem] text-stone-800 dark:text-stone-100 font-serif leading-[1] mb-8 tracking-tight">
              Where Every <br />
              <span className="italic font-light text-[#01696f] dark:text-teal-400">
                Meal Tells
              </span>{" "}
              <br />a Story
            </h1>
            <p className="text-lg text-stone-500 dark:text-stone-400 mb-12 leading-relaxed max-w-md font-light">
              Fresh ingredients, crafted with passion. Experience a culinary
              journey curated by our master chefs in the heart of the city.
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              <button
                onClick={() => router.push("/menu")}
                className="px-10 py-4 bg-[#01696f] text-white rounded-full font-medium tracking-wide hover:bg-[#014d52] hover:shadow-2xl hover:shadow-[#01696f]/20 transition-all active:scale-95"
              >
                Explore Menu
              </button>
              <button className="group flex items-center gap-3 text-[#01696f] dark:text-teal-400 font-medium hover:gap-5 transition-all duration-300">
                Our Story
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative h-[60vh] lg:h-[80vh]">
            <div className="absolute inset-0 bg-stone-100 dark:bg-stone-800 rounded-2xl overflow-hidden shadow-2xl shadow-stone-900/10">
              <Image
                src={HERO_IMAGE}
                alt="Exquisitely plated gourmet dish with vibrant vegetables and microgreens"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-8 md:px-12 bg-[#faf9f5] dark:bg-stone-950">
        <div className="max-w-[1440px] mx-auto border-y border-stone-200 dark:border-stone-800 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {INFO_CARDS.map(({ icon, title, body, extra }) => (
            <div
              key={title}
              className={`flex flex-col items-center md:items-start text-center md:text-left gap-4 ${extra}`}
            >
              {icon}
              <div>
                <h3 className="font-serif text-xl text-stone-800 dark:text-stone-100 mb-1">
                  {title}
                </h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm tracking-wide">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 px-8 md:px-20 bg-[#faf9f5] dark:bg-stone-950">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
          <div className="space-y-8">
            <span className="text-[#01696f] font-bold text-xs tracking-[0.3em] uppercase block">
              Provenance &amp; Philosophy
            </span>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight text-stone-800 dark:text-stone-100">
              Our kitchen is a studio where{" "}
              <span className="italic font-light text-[#01696f] dark:text-teal-400">
                texture meets memory.
              </span>
            </h2>
          </div>
          <div className="space-y-10 pt-2 md:pt-16">
            <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed font-light">
              We believe that the finest ingredients require the least
              interference. Our team collaborates with local foragers and
              small-batch producers to source elements that speak of the soil
              and sea from which they came.
            </p>
            <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed font-light">
              Every plate is a composition — an intentional balance of acidity,
              crunch, and aroma designed to transport the guest to a specific
              moment in time.
            </p>
            <div className="pt-6">
              <Link
                href="/"
                className="text-[#01696f] dark:text-teal-400 font-medium border-b border-[#01696f]/20 pb-1 hover:border-[#01696f] transition-all"
              >
                Read Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-20 bg-stone-50 dark:bg-stone-900">
        <div className="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[#01696f] font-bold text-[10px] tracking-[0.3em] uppercase mb-3 block">
              Chef&apos;s Selection
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-800 dark:text-stone-100">
              Seasonal Icons
            </h2>
            <p className="text-stone-400 dark:text-stone-500 mt-2 font-light text-sm">
              A curated selection of this month&apos;s essential tastes.
            </p>
          </div>
          <Link
            href="/menu"
            className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-widest
                 text-[#01696f] dark:text-teal-400
                 border border-[#01696f]/25 dark:border-teal-400/20
                 px-5 py-2.5 rounded-full whitespace-nowrap
                 hover:bg-[#01696f] hover:text-white
                 dark:hover:bg-teal-400 dark:hover:text-stone-900
                 transition-all"
          >
            View All Offerings
          </Link>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {menuRes?.data?.map((item) => (
            <DishCard
              key={item._id}
              id={item._id}
              name={item.name}
              subtitle={item.description ?? ""}
              price={item?.price?.toString() ?? 0}
              priceNum={item?.price}
              image={item?.image}
              chefsPick={item?.chefsPick}
              category={item?.category}
            />
          ))}
        </div>
      </section>

      <section className="py-32 px-8 md:px-12 bg-[#faf9f5] dark:bg-stone-950">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4">
            <span className="text-[#01696f] font-bold text-xs tracking-[0.3em] uppercase mb-4 block">
              The Process
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-800 dark:text-stone-100 leading-tight mb-8">
              How We <br />
              Serve You
            </h2>
            <p className="text-stone-500 dark:text-stone-400 leading-relaxed max-w-sm font-light">
              Experience fine dining from the comfort of your home with our
              streamlined ordering process.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-12">
            {STEPS.map(({ num, title, body }) => (
              <div key={num} className="group">
                <div className="text-5xl font-serif text-stone-300 dark:text-stone-700 group-hover:text-[#01696f] dark:group-hover:text-teal-400 transition-colors duration-300 mb-6">
                  {num}
                </div>
                <h3 className="text-xl font-serif mb-4 text-stone-800 dark:text-stone-100">
                  {title}
                </h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm font-light leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
