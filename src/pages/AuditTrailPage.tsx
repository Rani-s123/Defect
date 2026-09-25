import { useState, useEffect, useCallback } from 'react';
import { ScrollText } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Form';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { api } from '@/api';
import { useI18n } from '@/i18n';
import { formatTime } from '@/utils/format';
import type { AuditEntry } from '@/types';

export function AuditTrailPage() {
  const { t } = useI18n();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [entityFilter, setEntityFilter] = useState('');
  const [actorFilter, setActorFilter] = useState('');

  const entities = ['Defect', 'Alert', 'Ticket', 'NCR', 'Settings'];
  const actors = ['Operator', 'Field Engineer', 'Line Leader', 'Quality Engineer', 'System'];

  const load = useCallback(async () => {
    try {
      const data = await api.getAudit({
        entity: entityFilter || undefined,
        actor: actorFilter || undefined,
      });
      setEntries(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [entityFilter, actorFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <Layout title={t('audit.title')}>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{t('audit.subtitle')}</p>

      <Card className="mb-4">
        <CardBody>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Select
              label={t('audit.filterEntity')}
              value={entityFilter}
              onChange={setEntityFilter}
              options={entities.map((e) => ({ value: e, label: e }))}
              placeholder={t('common.all')}
            />
            <Select
              label={t('audit.filterActor')}
              value={actorFilter}
              onChange={setActorFilter}
              options={actors.map((a) => ({ value: a, label: a }))}
              placeholder={t('common.all')}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        {loading ? (
          <TableSkeleton rows={8} cols={5} />
        ) : error ? (
          <ErrorState message={t('common.error')} onRetry={load} />
        ) : entries.length === 0 ? (
          <EmptyState message={t('audit.empty')} icon={<ScrollText className="h-8 w-8 text-slate-300 dark:text-slate-600" />} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-2 font-medium">{t('common.time')}</th>
                  <th className="px-3 py-2 font-medium">{t('common.actor')}</th>
                  <th className="px-3 py-2 font-medium">{t('common.entity')}</th>
                  <th className="px-3 py-2 font-medium">{t('common.action')}</th>
                  <th className="px-3 py-2 font-medium">{t('common.details')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {entries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                    <td className="px-3 py-2 font-mono tabular-nums text-xs text-slate-500 dark:text-slate-400">{formatTime(e.timestamp)}</td>
                    <td className="px-3 py-2 text-xs text-slate-700 dark:text-slate-300">{e.actor}</td>
                    <td className="px-3 py-2 text-xs text-slate-700 dark:text-slate-300">{e.entity}</td>
                    <td className="px-3 py-2">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">{e.action}</span>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400">{e.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </Layout>
  );
}
