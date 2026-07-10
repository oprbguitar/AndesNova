import { useMemo, useState } from "react";
import { Header } from "./components/Header";
import { FloatingChatbot } from "./components/FloatingChatbot";
import { HomeView } from "./components/HomeView";
import { ContactModal } from "./components/ContactModal";
import { companyData } from "./data/companyData";
import { validateCompanyData } from "./utils/validateCompanyData";

export default function App() {
  const data = useMemo(() => validateCompanyData(companyData), []);
  const [selectedAreaId, setSelectedAreaId] = useState<string | undefined>();
  const [contactOpen, setContactOpen] = useState(false);
  const selectedArea = data.areas.find((area) => area.id === selectedAreaId);

  return (
    <main className="page-shell">
      <div className="app-card">
        <Header companyName={data.companyName} contact={data.contact} />
        <HomeView
          areas={data.areas}
          kpis={data.kpis}
          selectedArea={selectedArea}
          onSelectArea={setSelectedAreaId}
          onStartEvaluation={() => setContactOpen(true)}
        />
      </div>
      <ContactModal open={contactOpen} contact={data.contact} onClose={() => setContactOpen(false)} />
      <FloatingChatbot />
    </main>
  );
}
