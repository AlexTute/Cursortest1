import { Shield } from "@/components/Icons";

export default function HeroCard() {
  return (
    <div className="mb-8 fade-in">
      <div className="rounded-3xl p-6 sm:p-8 hover:scale-[1.02] transition-transform duration-300" style={{
        background: "linear-gradient(120deg, rgba(225,29,43,.65), rgba(246,196,69,.55), rgba(10,61,145,.6))"
      }}>
        <div className="badge badge-hero mb-4">CURRENT PLAN</div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-4xl font-bold">Researcher</div>
            <div className="mt-6 text-sm">API Usage</div>
            <div className="mt-2 text-sm text-[color:var(--muted)]">Monthly plan</div>
            <div className="mt-2 progress w-full max-w-xl">
              <span style={{ inset: "0 80% 0 0" }} />
            </div>
            <div className="mt-4 chip">
              <Shield className="h-3.5 w-3.5" /> Pay as you go
            </div>
          </div>
          <button className="rounded-lg px-4 py-2 card hover:opacity-90">
            Manage Plan
          </button>
        </div>
      </div>
    </div>
  );
}
