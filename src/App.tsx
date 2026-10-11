import { useCallback, useEffect, useState } from "react";
import { ChatLauncher } from "./components/ChatLauncher";
import { ContactModal } from "./components/ContactModal";
import { EvaluationWizard } from "./components/EvaluationWizard";
import { HeroScene } from "./components/HeroScene";
import { PhasePanel } from "./components/PhasePanel";
import { SiteHeader } from "./components/SiteHeader";
import { phaseIds, phases, type PhaseId } from "./data/phases";
import { contact } from "./data/site";

function phaseFromHash(): PhaseId {
  const hash = window.location.hash.replace("#", "") as PhaseId;
  return phaseIds.includes(hash) ? hash : "activa";
}

export default function App() {
  const [phaseId, setPhaseId] = useState<PhaseId>(phaseFromHash);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSummary, setContactSummary] = useState<string | undefined>();
  const [wizardOpen, setWizardOpen] = useState(false);
  const phase = phases.find((item) => item.id === phaseId) ?? phases[0];

  const selectPhase = useCallback((id: PhaseId) => {
    setPhaseId(id);
    history.replaceState(null, "", `#${id}`);
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "") as PhaseId;
      if (phaseIds.includes(hash)) setPhaseId(hash);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function openContact(summary?: string) {
    setContactSummary(summary);
    setContactOpen(true);
  }

  return (
    <div className="site">
      <SiteHeader activeId={phase.id} onSelect={selectPhase} onStart={() => setWizardOpen(true)} />
      <main>
        <HeroScene
          phase={phase}
          onSelect={selectPhase}
          onPrimary={() => openContact(`Me interesa la fase ${phase.name}: ${phase.cta.toLowerCase()}.`)}
          onDiagnosis={() => setWizardOpen(true)}
        />
        <PhasePanel phase={phase} onSelect={selectPhase} />
      </main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} AndesNova · Tu negocio más lejos</span>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </footer>

      <ChatLauncher phase={phase} onRequestContact={openContact} />
      <EvaluationWizard open={wizardOpen} onClose={() => setWizardOpen(false)} onRequestContact={openContact} />
      <ContactModal open={contactOpen} contact={contact} summary={contactSummary} onClose={() => setContactOpen(false)} />
    </div>
  );
}
