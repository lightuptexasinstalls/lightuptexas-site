'use client';
import { useFormStatus } from 'react-dom';

/** Delete button for the leads dashboard. Asks before deleting, because it can't be undone. */
export default function DeleteLeadButton({ name }: { name: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(`Delete ${name || 'this lead'}? This can't be undone.`)) e.preventDefault();
      }}
      style={{ minHeight: 30, padding: '0 12px', borderRadius: 999, border: '1px solid #E5B8B8', background: '#fff', color: '#9B2C2C', fontSize: 13, cursor: 'pointer' }}
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
