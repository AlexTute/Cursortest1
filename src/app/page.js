import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-[calc(100vh-80px)]">
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Build faster with a
              <span className="gradient-text"> modern Next.js starter</span>
            </h1>
            <p className="mt-4 text-[color:var(--muted)] text-base sm:text-lg">
              Pre-styled components, glass surfaces, and gradient accents out of the box.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/dashboards" className="rounded-full px-5 py-3 btn-primary text-center">
                Open Dashboard
              </Link>
              <a
                className="rounded-full px-5 py-3 card hover:opacity-90 text-center"
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the Docs
              </a>
            </div>
          </div>
          <div className="relative h-64 sm:h-80 lg:h-96">
            <div className="absolute inset-0 glass rounded-3xl" />
            <div className="absolute -inset-2 rounded-3xl blur-3xl opacity-60"
                 style={{background:"linear-gradient(90deg, var(--primary), var(--accent), var(--accent-2))"}} />
            <div className="relative h-full w-full flex items-center justify-center">
              <Image className="opacity-90" src="/next.svg" alt="Next.js" width={220} height={60} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Gradient tokens", "Glass panels", "Accessible defaults"].map((title, i) => (
            <div key={i} className="card rounded-2xl p-6">
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-[color:var(--muted)]">
                Ready-to-use UI primitives and styles to ship your next app.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
