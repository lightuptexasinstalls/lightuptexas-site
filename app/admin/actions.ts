'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { isAdmin, login } from '@/lib/auth';
import { getLead, saveLead, autoTags, deleteLead } from '@/lib/leads';
import { LEAD_STATUSES } from '@/config/site';

export async function loginAction(form: FormData) {
  const ok = await login(String(form.get('password') || ''));
  redirect(ok ? '/admin' : '/admin?e=1');
}

export async function updateLead(form: FormData) {
  if (!(await isAdmin())) redirect('/admin');
  const id = String(form.get('id') || '');
  const lead = await getLead(id);
  if (!lead) return;
  const status = String(form.get('status') || '');
  if (LEAD_STATUSES.includes(status)) lead.status = status;
  const tags = String(form.get('tags') || '').split(',').map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 20);
  lead.tags = [...lead.tags.filter((t) => t.startsWith('auto:')), ...tags.filter((t) => !t.startsWith('auto:'))];
  lead.tags = autoTags(lead);
  lead.notes = String(form.get('notes') || '').slice(0, 2000);
  await saveLead(lead);
  revalidatePath('/admin');
}

export async function deleteLeadAction(form: FormData) {
  if (!(await isAdmin())) redirect('/admin');
  const id = String(form.get('id') || '');
  if (id) await deleteLead(id);
  revalidatePath('/admin');
}
