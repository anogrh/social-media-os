import { Sparkles } from 'lucide-react'

export default function DailySummary() {
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(31,27,26,0.10)',
        borderLeft: '4px solid #F25BA5',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
      className="rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={15} style={{ color: '#F25BA5' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#F25BA5', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Resumo do dia
        </span>
        <span style={{ fontSize: 12, color: 'rgba(31,27,26,0.4)', marginLeft: 'auto' }}>
          {today}
        </span>
      </div>

      <blockquote
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 15,
          fontStyle: 'italic',
          color: '#1F1B1A',
          lineHeight: 1.7,
          borderLeft: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        "Hoje você tem <strong>3 tarefas urgentes</strong> para resolver: cobrar o pagamento do Café Maison (12 dias em atraso), finalizar o briefing da Clínica Dra. Ana Lima, e entregar o relatório do LOF Studio até amanhã.
        <br /><br />
        Em destaque, a Terra Viva teve seu{' '}
        <span style={{ color: '#F25BA5' }}>melhor mês histórico</span> com +640 seguidores e engajamento de 5,6% — excelente resultado para compartilhar com a cliente.
        A Sinta Gummies também está em alta, com 52k visualizações de Reels em 30 dias."
      </blockquote>

      <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: '1px solid rgba(31,27,26,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EE3528', display: 'inline-block' }}></span>
          <span style={{ color: 'rgba(31,27,26,0.7)' }}>3 urgentes</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }}></span>
          <span style={{ color: 'rgba(31,27,26,0.7)' }}>2 alertas</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
          <span style={{ color: 'rgba(31,27,26,0.7)' }}>Terra Viva em alta</span>
        </div>
      </div>
    </div>
  )
}
