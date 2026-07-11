import { useMemo, useState } from "react";
import { Header } from "./components/Header";
import { FloatingChatbot } from "./components/FloatingChatbot";
import { HomeView } from "./components/HomeView";
import { ContactModal } from "./components/ContactModal";
import { EvaluationWizard } from "./components/EvaluationWizard";
import { companyData } from "./data/companyData";
import { validateCompanyData } from "./utils/validateCompanyData";

export default function App() {
  const data = useMemo(() => validateCompanyData(companyData), []);
  const [selectedAreaId, setSelectedAreaId] = useState<string | undefined>();
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSummary, setContactSummary] = useState<string | undefined>();
  const [wizardOpen, setWizardOpen] = useState(false);
  const selectedArea = data.areas.find((area) => area.id === selectedAreaId);

  function openContact(summary?: string) {
    setContactSummary(summary);
    setContactOpen(true);
  }

  return (
    <main className="page-shell">
      <div className="app-card">
        <Header companyName={data.companyName} contact={data.contact} />
        <HomeView
          areas={data.areas}
          kpis={data.kpis}
          selectedArea={selectedArea}
          onSelectArea={setSelectedAreaId}
          onStartEvaluation={() => setWizardOpen(true)}
        />
      </div>
      <EvaluationWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onRequestContact={(summary) => openContact(summary)}
      />
      <ContactModal
        open={contactOpen}
        contact={data.contact}
        summary={contactSummary}
        onClose={() => setContactOpen(false)}
      />
      <FloatingChatbot onRequestContact={openContact} />
    </main>
  );
}
