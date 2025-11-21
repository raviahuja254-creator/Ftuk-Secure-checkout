import React, { useState } from "react";
import { motion } from "framer-motion";

// Account sizes
const ACCOUNT_SIZES = [
  { key: "5k", label: "$5,000" },
  { key: "10k", label: "$10,000" },
  { key: "25k", label: "$25,000" },
  { key: "50k", label: "$50,000" },
  { key: "100k", label: "$100,000" },
];

// Sections
const ACCOUNT_TYPES = ["One Phase", "Two Phase", "Instant Funding"];

// Prices (USD)
const PRICING = {
  "One Phase": {
    "5k": 40,
    "10k": 100,
    "25k": 179,
    "50k": 299,
    "100k": 599,
  },
  "Two Phase": {
    "5k": 50,
    "10k": 120,
    "25k": 229,
    "50k": 399,
    "100k": 699,
  },
  "Instant Funding": {
    "5k": 80,
    "10k": 199,
    "25k": 399,
    "50k": 799,
    "100k": 1499,
  },
};

const DEFAULT_TYPE = "One Phase";
const DEFAULT_SIZE = "5k";

export default function App() {
  const [accountType, setAccountType] = useState(DEFAULT_TYPE);
  const [accountSizeKey, setAccountSizeKey] = useState(DEFAULT_SIZE);

  const basePrice = PRICING[accountType][accountSizeKey];

  const [step, setStep] = useState("form"); // form | processing | complete
  const [form, setForm] = useState(() => ({
    fullName: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    country: "",
    amount: String(basePrice),
    discount: "",
  }));
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  // LOGO COMPONENT
  const Logo = () => (
    <svg
      width="160"
      height="40"
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-20 h-8"
    >
      <rect width="160" height="40" rx="4" fill="transparent" />
      <text
        x="6"
        y="28"
        fill="#FFFFFF"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="700"
        fontSize="28"
      >
        FTUK
      </text>
    </svg>
  );

  // Calculate discount logic
  const computeAmount = (type, sizeKey, discount) => {
    const base = PRICING[type][sizeKey];
    const isPowerup =
      discount && discount.trim().toUpperCase() === "POWERUP";
    return String(isPowerup ? Math.round(base * 0.65) : base);
  };

  const handleChange = (field) => (e) => {
    let value = e.target.value;

    if (field === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 19);
      value = value.replace(/(.{4})/g, "$1 ").trim();
    }

    if (field === "expiry") {
      value = value.replace(/[^0-9]/g, "").slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    }

    if (field === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }

    // Discount code
    if (field === "discount") {
      setForm((s) => ({
        ...s,
        discount: value,
        amount: computeAmount(accountType, accountSizeKey, value),
      }));
      return;
    }

    // Amount override
    if (field === "amount") {
      value = value.replace(/\D/g, "").slice(0, 7);
      setForm((s) => ({ ...s, amount: value, discount: "" }));
      return;
    }

    setForm((s) => ({ ...s, [field]: value }));
  };

  // Validation
  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (form.cardNumber.replace(/\s/g, "").length < 13)
      e.cardNumber = "Enter a valid card number";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry))
      e.expiry = "Expiry must be MM/YY";
    if (form.cvv.length < 3) e.cvv = "CVV required";
    if (!form.country) e.country = "Country required";
    if (!form.amount || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Submit handler w/ 5-sec processing animation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setProcessing(true);
    setStep("processing");

    await new Promise((r) => setTimeout(r, 5000)); // 5 seconds

    setProcessing(false);
    setStep("complete");

    alert(
      `Payment success!\nType: ${accountType}\nSize: ${
        ACCOUNT_SIZES.find((s) => s.key === accountSizeKey)?.label
      }\nAmount: $${form.amount}`
    );
  };

  const isPowerup =
    form.discount && form.discount.trim().toUpperCase() === "POWERUP";

  const selectAccountType = (type) => {
    setAccountType(type);
    setForm((s) => ({
      ...s,
      amount: computeAmount(type, accountSizeKey, s.discount),
    }));
  };

  const selectAccountSize = (key) => {
    setAccountSizeKey(key);
    setForm((s) => ({
      ...s,
      amount: computeAmount(accountType, key, s.discount),
    }));
  };

  return (
    <div className="min-h-screen bg-[#040A18] text-slate-100 flex flex-col">
      {/* Top promo bar */}
      <div className="bg-[#8B3DFF] text-white text-xs sm:text-sm text-center py-2">
        <span className="font-semibold">35% OFF</span>{" "}
        <span className="opacity-90">– Limited Time Only → Use Code:</span>{" "}
        <span className="font-extrabold">POWERUP</span>
      </div>

      {/* Navbar */}
      <header className="bg-[#050716] border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 gap-4">
          
          {/* LOGO ONLY — removed "FTUK Prop Firm" text */}
          <div className="flex items-center gap-3">
            <Logo />
          </div>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <div className="bg-[#0B1022] rounded-full p-1 flex items-center shadow-inner">
              <button className="px-4 py-1.5 rounded-full text-xs sm:text-sm bg-gradient-to-r from-[#b06bff] to-[#7c3aed] text-white shadow">
                Forex
              </button>
              <button className="px-4 py-1.5 rounded-full text-xs sm:text-sm text-slate-200">
                Futures
              </button>
            </div>

            {["Challenges", "About", "FAQ", "Affiliate", "Contact", "Login"].map(
              (item) => (
                <button
                  key={item}
                  className="text-slate-100 hover:text-white text-xs sm:text-sm"
                >
                  {item}
                </button>
              )
            )}
          </nav>

          {/* Get Funded Btn */}
          <div className="hidden sm:block">
            <button className="px-4 sm:px-5 py-2 rounded-2xl bg-[#0B1022] hover:bg-[#111a33] text-sm font-semibold text-white shadow">
              Get Funded
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex justify-center px-4 sm:px-6 py-6">
        <div className="w-full max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                CHECKOUT
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT SIDE */}
            <section className="lg:w-5/12 space-y-4">
              {/* Country Info */}
              <div className="bg-[#0B1022] rounded-2xl px-4 py-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-lg">🇮🇳</span>
                  <div>
                    <div className="font-medium">India, IN</div>
                    <div className="text-[10px] text-slate-400">IP: 2401:xxxx</div>
                  </div>
                </div>
                <button className="text-purple-300 underline text-xs">Support</button>
              </div>

              {/* Account Type / Size */}
              <div className="rounded-2xl bg-gradient-to-b from-[#5B21FF] via-[#4C1D95] to-[#111827] p-6 shadow-2xl border border-white/10">
                <h2 className="text-lg font-semibold mb-1">Account Information</h2>
                <p className="text-xs text-slate-200/80 mb-4">
                  Choose account type, size and pricing.
                </p>

                {/* Type */}
                <div className="mb-4">
                  <div className="text-xs mb-2 text-slate-200/80">Account Type</div>
                  <div className="flex flex-wrap gap-2">
                    {ACCOUNT_TYPES.map((type) => {
                      const active = accountType === type;
                      return (
                        <button
                          key={type}
                          onClick={() => selectAccountType(type)}
                          className={
                            "px-3 py-1.5 rounded-full text-xs border transition " +
                            (active
                              ? "bg-white text-purple-800 border-white shadow"
                              : "bg-white/5 border-white/10 text-slate-100 hover:bg-white/10")
                          }
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size */}
                <div className="mb-4">
                  <div className="text-xs mb-2 text-slate-200/80">Account Size</div>
                  <div className="flex flex-wrap gap-2">
                    {ACCOUNT_SIZES.map((size) => {
                      const active = accountSizeKey === size.key;
                      const price = PRICING[accountType][size.key];
                      return (
                        <button
                          key={size.key}
                          onClick={() => selectAccountSize(size.key)}
                          className={
                            "px-4 py-1.5 rounded-full text-xs border transition flex flex-col items-center " +
                            (active
                              ? "bg-purple-500 text-white border-purple-300 shadow"
                              : "bg-white/5 border-white/10 text-slate-100 hover:bg-white/10")
                          }
                        >
                          <span>{size.label}</span>
                          <span className="text-[10px] opacity-80">${price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-4 rounded-xl bg-black/25 border border-white/10 p-4 text-xs sm:text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-200">Selected Type</span>
                    <span>{accountType}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-200">Account Size</span>
                    <span>
                      {ACCOUNT_SIZES.find((s) => s.key === accountSizeKey)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-200">Base Price</span>
                    <span>${basePrice}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT SIDE CHECKOUT */}
            <section className="lg:w-7/12">
              <div className="bg-gradient-to-b from-[#061022] to-[#071428] rounded-2xl shadow-2xl overflow-hidden border border-white/5">
                <div className="p-6 sm:p-8">

                  {/* Checkout Header */}
                  <header className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs text-slate-400">2. Checkout</div>
                      <div className="text-lg font-semibold">COMPLETE YOUR ORDER</div>
                      <div className="text-xs text-slate-400">
                        Our pricing is simple with no hidden fees.
                      </div>
                    </div>
                    <div className="text-right">
                      {isPowerup ? (
                        <>
                          <div className="line-through text-slate-500 text-sm">
                            ${basePrice}
                          </div>
                          <div className="text-lg font-semibold text-green-400">
                            ${form.amount}
                          </div>
                        </>
                      ) : (
                        <div className="text-lg font-semibold">${form.amount}</div>
                      )}
                    </div>
                  </header>

                  {/* FORM */}
                  {step === "form" && (
                    <motion.form
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="block">
                          <div className="text-xs text-slate-400 mb-1">Full name</div>
                          <input
                            value={form.fullName}
                            onChange={handleChange("fullName")}
                            className="w-full rounded-md p-3 bg-[#021027] border border-transparent"
                            placeholder="Jane Q. Trader"
                          />
                        </label>

                        <label className="block">
                          <div className="text-xs text-slate-400 mb-1">Email</div>
                          <input
                            value={form.email}
                            onChange={handleChange("email")}
                            className="w-full rounded-md p-3 bg-[#021027] border border-transparent"
                            placeholder="you@domain.com"
                            type="email"
                          />
                        </label>
                      </div>

                      {/* Payment */}
                      <div>
                        <div className="text-xs text-slate-400 mb-2">Payment details</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            value={form.cardNumber}
                            onChange={handleChange("cardNumber")}
                            className="sm:col-span-2 w-full rounded-md p-3 bg-[#021027] border border-transparent"
                            placeholder="4242 4242 4242 4242"
                          />
                          <input
                            value={form.expiry}
                            onChange={handleChange("expiry")}
                            className="w-full rounded-md p-3 bg-[#021027] border border-transparent"
                            placeholder="MM/YY"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                          <input
                            value={form.cvv}
                            onChange={handleChange("cvv")}
                            className="w-full rounded-md p-3 bg-[#021027] border border-transparent"
                            placeholder="CVV"
                          />
                          <select
                            value={form.country}
                            onChange={handleChange("country")}
                            className="sm:col-span-2 w-full rounded-md p-3 bg-[#021027] border border-transparent"
                          >
                            <option value="">Billing country</option>
                            <option>United Kingdom</option>
                            <option>United States</option>
                            <option>India</option>
                            <option>Germany</option>
                            <option>France</option>
                          </select>
                        </div>
                      </div>

                      {/* Discount */}
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Discount code</div>
                        <input
                          value={form.discount}
                          onChange={handleChange("discount")}
                          className="w-full rounded-md p-3 bg-[#021027] border border-transparent"
                          placeholder="POWERUP for 35% off"
                        />
                        {isPowerup && (
                          <div className="text-sm text-green-400 mt-2">
                            POWERUP applied — 35% off
                          </div>
                        )}
                      </div>

                      {/* Amount */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        <label className="block sm:col-span-2">
                          <div className="text-xs text-slate-400 mb-1">Amount</div>
                          <input
                            value={form.amount}
                            onChange={handleChange("amount")}
                            className="w-full rounded-md p-3 bg-[#021027] border border-transparent"
                          />
                        </label>
                        <div className="text-right">
                          {isPowerup ? (
                            <>
                              <div className="line-through text-slate-500 text-sm">
                                ${basePrice}
                              </div>
                              <div className="text-lg font-semibold text-green-400">
                                ${form.amount}
                              </div>
                            </>
                          ) : (
                            <div className="text-lg font-semibold">${form.amount}</div>
                          )}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => window.history.back()}
                          className="px-4 py-2 rounded-md bg-transparent border border-slate-700 text-slate-300 text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={processing}
                          className="px-5 py-3 rounded-lg bg-gradient-to-r from-[#0B6BFF] to-[#7C3AED] text-white font-semibold shadow-lg"
                        >
                          {processing ? "Processing…" : `Pay $${form.amount}`}
                        </button>
                      </div>
                    </motion.form>
                  )}

                  {/* PROCESSING SCREEN */}
                  {step === "processing" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-10 text-center"
                    >
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#021027] mx-auto mb-4 animate-pulse">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6l4 2"
                          />
                        </svg>
                      </div>
                      <div className="text-lg font-medium">Processing payment</div>
                      <div className="text-sm text-slate-400 mt-2">
                        Securely communicating with your bank...
                      </div>
                    </motion.div>
                  )}

                  {/* COMPLETE SCREEN */}
                  {step === "complete" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-8 text-center"
                    >
                      <div className="w-28 h-28 rounded-full mx-auto grid place-items-center bg-gradient-to-br from-green-500 to-teal-400 mb-4 shadow-lg">
                        <svg
                          width="36"
                          height="36"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="#05231A"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      <h3 className="text-2xl font-semibold">Payment complete</h3>
                      <p className="text-slate-400 mt-2">
                        Thank you, {form.fullName || "trader"}! Your payment of $
                        {form.amount} is confirmed.
                      </p>

                      <button
                        onClick={() => {
                          setStep("form");
                          setForm({
                            fullName: "",
                            email: "",
                            cardNumber: "",
                            expiry: "",
                            cvv: "",
                            country: "",
                            amount: computeAmount(
                              accountType,
                              accountSizeKey,
                              ""
                            ),
                            discount: "",
                          });
                        }}
                        className="px-4 py-2 mt-6 rounded-md bg-gradient-to-r from-[#0B6BFF] to-[#7C3AED] text-white text-sm"
                      >
                        Make another payment
                      </button>
                    </motion.div>
                  )}
                </div>

                <footer className="border-t border-slate-800 p-4 text-xs text-slate-500 flex items-center justify-between">
                  <div>Secure · FTUK</div>
                  <div>
                    Need help?{" "}
                    <span className="underline">support@ftuk.com</span>
                  </div>
                </footer>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-b from-[#050716] to-[#040A18] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            
            {/* Left: Brand Info */}
            <div>
              <span className="text-3xl font-semibold tracking-tight">FTUK</span>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed mt-4">
                FTUK is a prop firm focused on giving traders fair, transparent
                and scalable funding. Our programs are built to reward
                consistency with clear rules, modern technology and fast payouts.
              </p>

              <div className="mt-8">
                <div className="text-sm text-slate-300 mb-3">Join socials</div>
                <div className="flex items-center gap-4 text-xl text-slate-200">
                  <button className="hover:text-white">𝕏</button>
                  <button className="hover:text-white">@</button>
                  <button className="hover:text-white">in</button>
                  <button className="hover:text-white">🎮</button>
                  <button className="hover:text-white">f</button>
                </div>
              </div>
            </div>

            {/* Right: Newsletter + Links */}
            <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              {/* Newsletter */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-2xl bg-[#09091d] border border-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  />
                  <button className="px-6 py-3 rounded-2xl bg-[#8B3DFF] text-sm font-semibold text-white">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Link Columns */}
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="font-semibold mb-3">Main Home</div>
                  <ul className="space-y-2 text-slate-300">
                    <li>Home</li>
                    <li>About</li>
                    <li>FAQ</li>
                    <li>Affiliate</li>
                    <li>Blog</li>
                  </ul>
                </div>

                <div>
                  <div className="font-semibold mb-3">Legal</div>
                  <ul className="space-y-2 text-slate-300">
                    <li>Privacy Policy</li>
                    <li>Terms &amp; Conditions</li>
                    <li>Outline &amp; Fees</li>
                  </ul>
                </div>
              </div>
            </div>
          
          </div>
        </div>
      </footer>

    </div>
  );
}
