import { useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");

  const [generatedReply, setGeneratedReply] = useState("");
  const [summary, setSummary] = useState("");
  const [intent, setIntent] = useState("");
  const [priority, setPriority] = useState("");

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!emailContent.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/email/generate`,
        {
          emailContent,
          tone
        }
      );

      console.log("Backend response:", response.data);

      setGeneratedReply(response.data.reply || "");
      setSummary(response.data.summary || "");
      setIntent(response.data.intent || "");
      setPriority(response.data.priority || "");

    } catch (error) {

      console.error("Generation error:", error);

      if (error.response?.status === 429) {
        setError("Too many requests. Please try again later.");
      } else {
        setError(
          error.response?.data ||
          "Failed to generate email reply."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedReply) return;

    await navigator.clipboard.writeText(generatedReply);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleClear = () => {
    setEmailContent("");
    setTone("");
    setGeneratedReply("");
    setSummary("");
    setIntent("");
    setPriority("");
    setError("");
    setCopied(false);
  };

  const getPriorityStyle = () => {
    if (priority?.toLowerCase() === "high") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    if (priority?.toLowerCase() === "medium") {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
    }

    return "border-green-500/20 bg-green-500/10 text-green-400";
  };

  return (
    <div className="min-h-screen bg-[#080b14] text-white">

      {/* Background Glow */}
      <div className="fixed inset-0 -z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-[#080b14]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <span className="text-xl">✦</span>
            </div>

            <div>
              <h1 className="text-lg font-bold">
                SmartMail AI
              </h1>

              <p className="text-xs text-gray-500">
                AI Email Intelligence Assistant
              </p>
            </div>

          </div>

          <div className="hidden items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />

            <span className="text-xs font-medium text-green-400">
              AI Ready
            </span>
          </div>

        </div>
      </nav>


      {/* Main */}
      <main className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-16">

        {/* Hero */}
        <section className="mx-auto mb-12 max-w-3xl text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2">

            <span className="text-indigo-400">
              ✨
            </span>

            <span className="text-xs font-semibold tracking-wider text-indigo-300">
              LLM-POWERED EMAIL INTELLIGENCE
            </span>

          </div>

          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">

            Understand emails

            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Generate smarter replies.
            </span>

          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            Analyze email intent, priority and key information, then
            generate a context-aware response using AI.
          </p>

        </section>


        {/* Main Workspace */}
        <section className="grid gap-6 lg:grid-cols-2">


          {/* LEFT: Original Email */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20 backdrop-blur-xl">

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  ✉
                </div>

                <div>
                  <h3 className="font-semibold">
                    Original Email
                  </h3>

                  <p className="text-xs text-gray-500">
                    Paste the email you received
                  </p>
                </div>

              </div>

              <button
                onClick={handleClear}
                disabled={!emailContent && !generatedReply}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                title="Clear"
              >
                🗑
              </button>

            </div>


            <div className="p-5">

              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Paste your email here..."
                rows={11}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-gray-200 outline-none placeholder:text-gray-600 transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
              />

              <div className="mt-2 flex justify-between">
                <span className="text-xs text-gray-600">
                  AI will analyze this email
                </span>

                <span className="text-xs text-gray-600">
                  {emailContent.length} characters
                </span>
              </div>


              {/* Tone */}
              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Reply Tone
                </label>

                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#101421] px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                >

                  <option value="">
                    Default
                  </option>

                  <option value="professional">
                    Professional
                  </option>

                  <option value="friendly">
                    Friendly
                  </option>

                  <option value="casual">
                    Casual
                  </option>

                  <option value="formal">
                    Formal
                  </option>

                  <option value="concise">
                    Concise
                  </option>

                </select>

              </div>


              {/* Generate */}
              <button
                onClick={handleSubmit}
                disabled={!emailContent.trim() || loading}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40"
              >

                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Analyzing Email...
                  </>
                ) : (
                  <>
                    <span>✦</span>
                    Analyze & Generate Reply
                  </>
                )}

              </button>

            </div>

          </div>


          {/* RIGHT SIDE */}
          <div className="space-y-6">


            {/* AI Intelligence */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20 backdrop-blur-xl">

              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  🧠
                </div>

                <div>
                  <h3 className="font-semibold">
                    AI Email Intelligence
                  </h3>

                  <p className="text-xs text-gray-500">
                    AI-powered analysis of your email
                  </p>
                </div>

              </div>


              <div className="p-5">

                {loading ? (

                  <div className="flex min-h-[220px] flex-col items-center justify-center">

                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />

                    <p className="mt-4 text-sm text-gray-400">
                      Understanding your email...
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                      Detecting intent, priority and key information
                    </p>

                  </div>

                ) : intent ? (

                  <div className="space-y-4">

                    {/* Intent + Priority */}
                    <div className="grid grid-cols-2 gap-3">

                      <div className="rounded-xl border border-white/10 bg-black/20 p-4">

                        <p className="text-xs text-gray-500">
                          Detected Intent
                        </p>

                        <p className="mt-2 text-sm font-semibold text-indigo-300">
                          {intent}
                        </p>

                      </div>


                      <div className="rounded-xl border border-white/10 bg-black/20 p-4">

                        <p className="text-xs text-gray-500">
                          Priority
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityStyle()}`}
                        >
                          {priority || "Unknown"}
                        </span>

                      </div>

                    </div>


                    {/* Summary */}
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">

                      <div className="flex items-center gap-2">

                        <span className="text-indigo-400">
                          ✨
                        </span>

                        <p className="text-sm font-semibold text-gray-300">
                          AI Summary
                        </p>

                      </div>

                      <p className="mt-3 text-sm leading-6 text-gray-400">
                        {summary}
                      </p>

                    </div>

                  </div>

                ) : (

                  <div className="flex min-h-[220px] flex-col items-center justify-center text-center">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/10 bg-purple-500/10 text-xl text-purple-400">
                      🧠
                    </div>

                    <h3 className="mt-4 font-semibold text-gray-300">
                      Email analysis will appear here
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">
                      AI will identify the email intent, priority and
                      provide a concise summary.
                    </p>

                  </div>

                )}

              </div>

            </div>


            {/* Generated Reply */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20 backdrop-blur-xl">

              <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    ✨
                  </div>

                  <div>

                    <h3 className="font-semibold">
                      AI Generated Reply
                    </h3>

                    <p className="text-xs text-gray-500">
                      Context-aware response
                    </p>

                  </div>

                </div>


                {generatedReply && (
                  <button
                    onClick={handleCopy}
                    className="rounded-lg p-2 text-gray-500 transition hover:bg-white/10 hover:text-white"
                    title="Copy"
                  >
                    📋
                  </button>
                )}

              </div>


              <div className="p-5">

                {generatedReply ? (

                  <div>

                    <textarea
                      value={generatedReply}
                      onChange={(e) =>
                        setGeneratedReply(e.target.value)
                      }
                      rows={8}
                      className="w-full resize-none rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-gray-200 outline-none transition focus:border-purple-500/50"
                    />

                    <button
                      onClick={handleCopy}
                      className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-500/5 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/10"
                    >
                      {copied ? "✓ Copied!" : "📋 Copy to Clipboard"}
                    </button>

                  </div>

                ) : (

                  <div className="flex min-h-[250px] flex-col items-center justify-center text-center">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/10 bg-indigo-500/10 text-2xl text-indigo-400">
                      ✨
                    </div>

                    <h3 className="mt-5 font-semibold text-gray-300">
                      Your AI reply will appear here
                    </h3>

                    <p className="mt-2 max-w-xs text-sm leading-6 text-gray-600">
                      Paste an email and click Analyze & Generate Reply.
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>

        </section>


        {/* Error */}
        {error && (
          <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}


        {/* Features */}
        <section className="mt-12 grid gap-4 sm:grid-cols-3">

          <Feature
            icon="🧠"
            title="Email Intelligence"
            description="Detect intent, priority and summarize incoming emails using AI."
          />

          <Feature
            icon="✨"
            title="LLM-Powered Replies"
            description="Generate context-aware responses using Google Gemini."
          />

          <Feature
            icon="🎯"
            title="Multiple Tones"
            description="Generate professional, friendly, formal, casual or concise replies."
          />

        </section>


        {/* Tech Stack */}
        <section className="mt-8 flex flex-wrap items-center justify-center gap-2">

          <TechBadge text="React" />
          <TechBadge text="Spring Boot" />
          <TechBadge text="Gemini LLM" />
          <TechBadge text="NLP" />
          <TechBadge text="Tailwind CSS" />
          <TechBadge text="REST API" />

        </section>


        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-gray-600 sm:flex-row">

          <p>
            © 2026 SmartMail AI
          </p>

          <p>
            AI Powered • Analyze • Generate • Review
          </p>

        </footer>

      </main>

    </div>
  );
}


function Feature({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-indigo-500/20 hover:bg-white/[0.04]">

      <div className="mb-3 text-xl">
        {icon}
      </div>

      <h3 className="font-semibold text-gray-200">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-gray-600">
        {description}
      </p>

    </div>
  );
}


function TechBadge({ text }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-500">
      {text}
    </span>
  );
}


export default App;