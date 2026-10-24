import { useId, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { copy } from "../data/copy";
import type { LearnerProfile } from "../types/progress";
import { BuddyChoices } from "./BuddyChoices";

export function ProfileEditor({ profile, onSave, onCancel }: {
  profile: LearnerProfile;
  onSave: (patch: Pick<LearnerProfile, "name" | "avatarId">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(profile.name);
  const [avatarId, setAvatarId] = useState(profile.avatarId);
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();

  function save(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      setError(trimmed.length < 2 ? copy.nameTooShort : copy.nameTooLong);
      return;
    }
    onSave({ name: trimmed, avatarId });
  }

  return <form className="profile-editor" onSubmit={save}>
    <label className="field">
      <span className="t-title-sm">{copy.firstName}</span>
      <input value={name} onChange={event => { setName(event.target.value); setError(null); }}
        autoComplete="nickname" maxLength={20} aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined} />
    </label>
    {error ? <p id={errorId} className="t-body" role="alert">{error}</p> : null}
    <BuddyChoices avatarId={avatarId} onChange={setAvatarId} />
    <div className="settings-actions">
      <button type="submit" className="btn btn-primary btn-block"><Check size={20} aria-hidden />{copy.saveChanges}</button>
      <button type="button" className="btn btn-secondary btn-block" onClick={onCancel}>{copy.cancel}</button>
    </div>
  </form>;
}
