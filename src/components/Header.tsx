import { Mail } from "lucide-react";

type HeaderProps = {
  companyName: string;
  contact: { name: string; email: string };
};

export function Header({ companyName, contact }: HeaderProps) {
  return (
    <header className="app-header">
      <a className="brand" href="#inicio" aria-label="Ir a inicio">
        <span className="brand-mark" aria-hidden="true">
          <span />
        </span>
        <span>{companyName}</span>
      </a>

      <a className="header-contact" href={`mailto:${contact.email}`}>
        <span className="header-contact-icon" aria-hidden="true">
          <Mail size={18} />
        </span>
        <span className="header-contact-copy">
          <strong>Consultas a {contact.name}</strong>
          <small>{contact.email}</small>
        </span>
      </a>
    </header>
  );
}
