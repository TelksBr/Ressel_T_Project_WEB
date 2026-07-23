import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Management } from './components/Management';
import { Plans } from './components/Plans';
import { Features } from './components/Features';
import { CallToAction } from './components/CallToAction';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-surface">
      <div className="pointer-events-none fixed inset-0 bg-mesh-gradient" aria-hidden="true" />
      <div
        className="pointer-events-none fixed -left-32 top-20 h-[500px] w-[500px] animate-pulse-glow rounded-full bg-brand-600/20 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -right-32 top-1/3 h-[400px] w-[400px] animate-pulse-glow rounded-full bg-accent-cyan/10 blur-[100px] animation-delay-200"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 animate-pulse-glow rounded-full bg-accent-fuchsia/10 blur-[120px] animation-delay-400"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHg9IjAiIHk9IjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-60"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <Navigation />
        <main>
          <Hero />
          <Management />
          <Plans />
          <Features />
          <CallToAction />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
