import { PackageOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = PackageOpen, title, text, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={36} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {text && <p className="empty-state-text">{text}</p>}
      {action}
    </div>
  );
}
