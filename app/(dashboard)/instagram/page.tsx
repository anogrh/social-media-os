'use client'

import { useState } from 'react'
import {
  Camera, TrendingUp, TrendingDown, Users, Eye, Heart, Play,
  BookMarked, Share2, MessageCircle, BarChart2, Repeat2, ArrowUpRight, Zap
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import Header from '@/components/layout/Header'
import { clients, instagramAccounts, generateDailyMetrics } from '@/lib/mock-data'
import { formatNumber } from '@/lib/utils'

// ─── Mock story data ────────────────────────────────────────────────────────
function generateStoryData(days = 14) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    return {
      date: d.toISOString().split('T')[0],
      alcance: Math.floor(Math.random() * 2000) + 800,
      impressoes: Math.floor(Math.random() * 3000) + 1200,
      respostas: Math.floor(Math.random() * 80) + 10,
      saidas: Math.floor(Math.random() * 300) + 80,
      avancou: Math.floor(Math.random() * 400) + 100,
    }
  })
}

function generateReelsData(count = 8) {
  const titles = [
    'Rotina matinal saudável', 'Os 5 benefícios do magnésio', 'Como compostar em casa',
    'Tour pelo estúdio', 'Receita com produto', 'Trend com áudio viral',
    'Bastidores da marca', 'Dica rápida para o dia',
  ]
  return Array.from({ length: count }, (_, i) => ({
    id: `r${i}`,
    titulo: titles[i % titles.length],
    alcance: Math.floor(Math.random() * 15000) + 3000,
    reproducoes: Math.floor(Math.random() * 20000) + 5000,
    curtidas: Math.floor(Math.random() * 800) + 100,
    comentarios: Math.floor(Math.random() * 120) + 10,
    compartilhamentos: Math.floor(Math.random() * 400) + 30,
    salvamentos: Math.floor(Math.random() * 300) + 20,
    data: `0${(i % 9) + 1}/06`,
  }))
}

function generateFeedData(count = 6) {
  const titles = [
    'Lançamento produto X', 'Collab especial', 'Post educativo', 'Depoimento cliente',
    'Bastidores', 'Campanha mensal',
  ]
  return Array.from({ length: count }, (_, i) => ({
    id: `f${i}`,
    titulo: titles[i % titles.length],
    tipo: i % 2 === 0 ? 'Carrossel' : 'Post único',
    alcance: Math.floor(Math.random() * 8000) + 1000,
    impressoes: Math.floor(Math.random() * 12000) + 2000,
    curtidas: Math.floor(Math.random() * 500) + 50,
    comentarios: Math.floor(Math.random() * 80) + 5,
    compartilhamentos: Math.floor(Math.random() * 200) + 10,
    salvamentos: Math.floor(Math.random() * 350) + 20,
    data: `0${(i % 9) + 1}/06`,
  }))
}

const METRIC_TABS = ['Perfil', 'Stories', 'Reels', 'Feed']

const S = {
  card: { background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.10)', borderRadius: 12, padding: '16px' },
  tinted: { background: '#F5F4F2', borderRadius: 12, padding: '14px 16px' },
  label: { fontSize: 11 as const, color: 'rgba(31,27,26,0.45)' as const, fontWeight: 700 as const, textTransform: 'uppercase' as const, letterSpacing: '0.07em' as const },
  value: { fontSize: 24 as const, fontWeight: 700 as const, color: '#1F1B1A' as const, marginTop: 6 },
}

const chartStyle = {
  contentStyle: { background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.12)', borderRadius: 10, fontFamily: 'Inter', fontSize: 12 },
  gridProps: { strokeDasharray: '0' as const, stroke: 'rgba(31,27,26,0.06)', vertical: false as const },
  axisProps: { axisLine: false as const, tickLine: false as const },
}

export default function InstagramPage() {
  const [selectedClientId, setSelectedClientId] = useState('c1')
  const [activeTab, setActiveTab] = useState('Perfil')

  const ig = instagramAccounts.find(a => a.clientId === selectedClientId)
  const client = clients.find(c => c.id === selectedClientId)
  const dailyMetrics = generateDailyMetrics(ig?.followers || 10000, 30)
  const storyData = generateStoryData(14)
  const reelsData = generateReelsData(8)
  const feedData = generateFeedData(6)

  const font = "'Inter', system-ui, sans-serif"

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Header title="Instagram analytics" subtitle="Performance detalhada das contas conectadas" />

      <div style={{ padding: '24px 28px', fontFamily: font }}>

        {/* Selector row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedClientId}
            onChange={e => setSelectedClientId(e.target.value)}
            style={{ border: '1px solid rgba(31,27,26,0.15)', borderRadius: 999, padding: '10px 18px', fontSize: 13, background: '#F5F4F2', color: '#1F1B1A', outline: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {ig?.connected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#10B981', fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              Conectado · {ig.handle}
            </div>
          ) : (
            <button style={{ background: '#F25BA5', color: '#FFFFFF', borderRadius: 999, padding: '10px 20px', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Camera size={15} /> Conectar Instagram
            </button>
          )}

          <div style={{ flex: 1 }} />

          {/* Period picker */}
          <div style={{ display: 'flex', gap: 4, background: '#F5F4F2', borderRadius: 999, padding: 4 }}>
            {['7d', '30d', '90d'].map(p => (
              <button key={p} style={{
                background: p === '30d' ? '#F25BA5' : 'transparent',
                color: p === '30d' ? '#FFFFFF' : 'rgba(31,27,26,0.6)',
                borderRadius: 999, border: 'none', padding: '5px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {!ig?.connected ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Camera size={48} style={{ color: 'rgba(31,27,26,0.2)', margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: '#1F1B1A', marginBottom: 8 }}>Instagram não conectado</h3>
            <p style={{ fontSize: 14, color: 'rgba(31,27,26,0.5)', maxWidth: 340, margin: '0 auto 24px' }}>
              Conecte a conta do Instagram de <strong>{client?.name}</strong> para ver os dados reais de performance.
            </p>
            <button style={{ background: '#F25BA5', color: '#FFFFFF', borderRadius: 999, padding: '12px 28px', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <Camera size={16} /> Conectar conta do Instagram
            </button>
          </div>
        ) : ig && (
          <>
            {/* Sub-tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(31,27,26,0.10)', marginBottom: 24 }}>
              {METRIC_TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  background: 'none', border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #F25BA5' : '2px solid transparent',
                  color: activeTab === tab ? '#F25BA5' : 'rgba(31,27,26,0.55)',
                  padding: '10px 18px', fontSize: 13,
                  fontWeight: activeTab === tab ? 700 : 500,
                  cursor: 'pointer', marginBottom: -1,
                  fontFamily: font, transition: 'all 0.15s',
                }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* ── PERFIL ────────────────────────────────── */}
            {activeTab === 'Perfil' && (
              <div>
                {/* KPI row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                  {[
                    { icon: Users, label: 'Seguidores', value: formatNumber(ig.followers), sub: `${ig.newFollowers30d >= 0 ? '+' : ''}${ig.newFollowers30d} este mês`, color: '#F25BA5', bg: '#FBD0DA', up: ig.newFollowers30d >= 0 },
                    { icon: Eye, label: 'Alcance 30d', value: formatNumber(ig.reach30d), sub: 'contas únicas', color: '#3B82F6', bg: '#dbeafe', up: true },
                    { icon: Heart, label: 'Engajamento', value: `${ig.engagementRate}%`, sub: ig.engagementRate >= 4 ? 'Acima da média ✓' : 'Abaixo da média ↓', color: ig.engagementRate >= 4 ? '#10B981' : '#EE3528', bg: ig.engagementRate >= 4 ? '#d1fae5' : '#fee2e2', up: ig.engagementRate >= 4 },
                    { icon: Play, label: 'Views Reels', value: formatNumber(ig.reelsViews30d), sub: '30 dias', color: '#F19877', bg: '#F5F4F2', up: true },
                  ].map(m => (
                    <div key={m.label} style={S.card}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <m.icon size={16} style={{ color: m.color }} />
                        </div>
                        {m.up
                          ? <TrendingUp size={14} style={{ color: '#10B981' }} />
                          : <TrendingDown size={14} style={{ color: '#EE3528' }} />
                        }
                      </div>
                      <p style={{ fontSize: 28, fontWeight: 700, color: '#1F1B1A', lineHeight: 1 }}>{m.value}</p>
                      <p style={{ fontSize: 12, color: 'rgba(31,27,26,0.5)', marginTop: 5 }}>{m.label}</p>
                      <p style={{ fontSize: 11, color: 'rgba(31,27,26,0.4)', marginTop: 2 }}>{m.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
                  <div style={{ ...S.card, padding: '20px 20px 10px' }}>
                    <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A', marginBottom: 16 }}>Crescimento de seguidores — 30 dias</h4>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={dailyMetrics}>
                        <CartesianGrid {...chartStyle.gridProps} />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(31,27,26,0.4)' }} tickFormatter={d => d.slice(8)} {...chartStyle.axisProps} interval={4} />
                        <YAxis tick={{ fontSize: 10, fill: 'rgba(31,27,26,0.4)' }} {...chartStyle.axisProps} tickFormatter={v => formatNumber(v)} domain={['auto', 'auto']} />
                        <Tooltip contentStyle={chartStyle.contentStyle} />
                        <Line type="monotone" dataKey="followers" stroke="#F25BA5" strokeWidth={2.5} dot={false} name="Seguidores" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={S.card}>
                    <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A', marginBottom: 16 }}>Resumo do perfil</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        { label: 'Impressões 30d', value: formatNumber(ig.impressions30d) },
                        { label: 'Visitas ao perfil', value: formatNumber(ig.profileVisits30d) },
                        { label: 'Posts salvos 30d', value: formatNumber(ig.savedPosts30d) },
                        { label: 'Stories views 30d', value: formatNumber(ig.storiesViews30d) },
                        { label: 'Total de posts', value: ig.posts },
                        { label: 'Seguindo', value: formatNumber(ig.following) },
                      ].map(m => (
                        <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid rgba(31,27,26,0.06)' }}>
                          <span style={{ fontSize: 12, color: 'rgba(31,27,26,0.55)' }}>{m.label}</span>
                          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A' }}>{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reach & engagement chart */}
                <div style={{ ...S.card, padding: '20px 20px 10px' }}>
                  <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A', marginBottom: 16 }}>Alcance e engajamento diário</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={dailyMetrics}>
                      <CartesianGrid {...chartStyle.gridProps} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(31,27,26,0.4)' }} tickFormatter={d => d.slice(8)} {...chartStyle.axisProps} interval={4} />
                      <YAxis tick={{ fontSize: 10, fill: 'rgba(31,27,26,0.4)' }} {...chartStyle.axisProps} />
                      <Tooltip contentStyle={chartStyle.contentStyle} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="reach" stroke="#F19877" strokeWidth={2} dot={false} name="Alcance" />
                      <Line type="monotone" dataKey="engagement" stroke="#F25BA5" strokeWidth={2} dot={false} name="Engajamento" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* ── STORIES ───────────────────────────────── */}
            {activeTab === 'Stories' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
                  {[
                    { label: 'Alcance total 14d', value: formatNumber(storyData.reduce((a, s) => a + s.alcance, 0)), icon: Eye, color: '#F25BA5', bg: '#FBD0DA' },
                    { label: 'Impressões 14d', value: formatNumber(storyData.reduce((a, s) => a + s.impressoes, 0)), icon: BarChart2, color: '#3B82F6', bg: '#dbeafe' },
                    { label: 'Respostas 14d', value: formatNumber(storyData.reduce((a, s) => a + s.respostas, 0)), icon: MessageCircle, color: '#10B981', bg: '#d1fae5' },
                    { label: 'Saídas (exit)', value: formatNumber(storyData.reduce((a, s) => a + s.saidas, 0)), icon: TrendingDown, color: '#EE3528', bg: '#fee2e2' },
                    { label: 'Avançou 14d', value: formatNumber(storyData.reduce((a, s) => a + s.avancou, 0)), icon: ArrowUpRight, color: '#F19877', bg: '#F5F4F2' },
                  ].map(m => (
                    <div key={m.label} style={S.tinted}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                        <m.icon size={14} style={{ color: m.color }} />
                      </div>
                      <p style={{ fontSize: 22, fontWeight: 700, color: '#1F1B1A' }}>{m.value}</p>
                      <p style={{ fontSize: 11, color: 'rgba(31,27,26,0.5)', marginTop: 4 }}>{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Stories chart */}
                <div style={{ ...S.card, padding: '20px 20px 10px', marginBottom: 20 }}>
                  <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A', marginBottom: 16 }}>Alcance e respostas — últimos 14 dias</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={storyData} barSize={12}>
                      <CartesianGrid {...chartStyle.gridProps} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(31,27,26,0.4)' }} tickFormatter={d => d.slice(8)} {...chartStyle.axisProps} />
                      <YAxis tick={{ fontSize: 10, fill: 'rgba(31,27,26,0.4)' }} {...chartStyle.axisProps} />
                      <Tooltip contentStyle={chartStyle.contentStyle} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="alcance" name="Alcance" fill="#F25BA5" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="respostas" name="Respostas" fill="#FBD0DA" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Insights boxes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  {[
                    { title: 'Melhor dia de Stories', desc: 'Stories de 12/jun tiveram 2.340 de alcance — acima 40% da média. Tema: rotina de sono.', color: '#d1fae5', border: '#10B981' },
                    { title: 'Pior sequência', desc: 'Stories de 09/jun registraram 38% de taxa de saída — avaliar se a sequência ficou longa demais.', color: '#fee2e2', border: '#EE3528' },
                    { title: 'Dica estratégica', desc: 'Stories com enquetes tiveram 3× mais respostas. Recomendação: aumentar para 3 enquetes por semana.', color: '#FBD0DA', border: '#F25BA5' },
                  ].map(box => (
                    <div key={box.title} style={{ background: box.color, borderRadius: 12, borderLeft: `3px solid ${box.border}`, padding: '16px 18px' }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1F1B1A', marginBottom: 8 }}>{box.title}</p>
                      <p style={{ fontSize: 12, color: 'rgba(31,27,26,0.7)', lineHeight: 1.6 }}>{box.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── REELS ─────────────────────────────────── */}
            {activeTab === 'Reels' && (
              <div>
                {/* KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                  {[
                    { label: 'Reproduções totais', value: formatNumber(reelsData.reduce((a, r) => a + r.reproducoes, 0)), icon: Play, color: '#F25BA5', bg: '#FBD0DA' },
                    { label: 'Compartilhamentos', value: formatNumber(reelsData.reduce((a, r) => a + r.compartilhamentos, 0)), icon: Share2, color: '#3B82F6', bg: '#dbeafe' },
                    { label: 'Salvamentos', value: formatNumber(reelsData.reduce((a, r) => a + r.salvamentos, 0)), icon: BookMarked, color: '#10B981', bg: '#d1fae5' },
                    { label: 'Alcance total', value: formatNumber(reelsData.reduce((a, r) => a + r.alcance, 0)), icon: Eye, color: '#F19877', bg: '#F5F4F2' },
                  ].map(m => (
                    <div key={m.label} style={S.tinted}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                        <m.icon size={14} style={{ color: m.color }} />
                      </div>
                      <p style={{ fontSize: 22, fontWeight: 700, color: '#1F1B1A' }}>{m.value}</p>
                      <p style={{ fontSize: 11, color: 'rgba(31,27,26,0.5)', marginTop: 4 }}>{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Reels table */}
                <div style={{ background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.10)', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(31,27,26,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A' }}>Reels do período</h4>
                    <span style={{ fontSize: 12, color: 'rgba(31,27,26,0.45)' }}>Ordenado por reproduções</span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#F5F4F2' }}>
                      <tr>
                        {['Título', 'Data', 'Reproduções', 'Alcance', 'Curtidas', 'Coment.', 'Compart.', 'Salvamentos'].map(h => (
                          <th key={h} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(31,27,26,0.45)', textAlign: 'left', padding: '10px 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...reelsData].sort((a, b) => b.reproducoes - a.reproducoes).map((r, i) => (
                        <tr key={r.id} style={{ borderTop: '1px solid rgba(31,27,26,0.05)', background: i === 0 ? '#FBD0DA22' : undefined }}>
                          <td style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            {i === 0 && <Zap size={12} style={{ color: '#F25BA5', flexShrink: 0 }} />}
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#1F1B1A', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.titulo}</span>
                          </td>
                          <td style={{ fontSize: 12, color: 'rgba(31,27,26,0.5)', padding: '12px 14px' }}>{r.data}</td>
                          <td style={{ fontSize: 13, fontWeight: 700, color: '#F25BA5', padding: '12px 14px' }}>{formatNumber(r.reproducoes)}</td>
                          <td style={{ fontSize: 13, color: '#1F1B1A', padding: '12px 14px' }}>{formatNumber(r.alcance)}</td>
                          <td style={{ fontSize: 13, color: '#1F1B1A', padding: '12px 14px' }}>{formatNumber(r.curtidas)}</td>
                          <td style={{ fontSize: 13, color: '#1F1B1A', padding: '12px 14px' }}>{r.comentarios}</td>
                          <td style={{ fontSize: 13, color: '#1F1B1A', padding: '12px 14px' }}>{r.compartilhamentos}</td>
                          <td style={{ fontSize: 13, color: '#1F1B1A', padding: '12px 14px' }}>{r.salvamentos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bar chart */}
                <div style={{ ...S.card, padding: '20px 20px 10px' }}>
                  <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A', marginBottom: 16 }}>Reproduções × alcance por Reel</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={reelsData} barSize={16}>
                      <CartesianGrid {...chartStyle.gridProps} />
                      <XAxis dataKey="data" tick={{ fontSize: 10, fill: 'rgba(31,27,26,0.4)' }} {...chartStyle.axisProps} />
                      <YAxis tick={{ fontSize: 10, fill: 'rgba(31,27,26,0.4)' }} {...chartStyle.axisProps} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={chartStyle.contentStyle} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="reproducoes" name="Reproduções" fill="#F25BA5" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="alcance" name="Alcance" fill="#FBD0DA" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* ── FEED ──────────────────────────────────── */}
            {activeTab === 'Feed' && (
              <div>
                {/* KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                  {[
                    { label: 'Alcance total', value: formatNumber(feedData.reduce((a, f) => a + f.alcance, 0)), icon: Eye, color: '#F25BA5', bg: '#FBD0DA' },
                    { label: 'Salvamentos', value: formatNumber(feedData.reduce((a, f) => a + f.salvamentos, 0)), icon: BookMarked, color: '#10B981', bg: '#d1fae5' },
                    { label: 'Compartilhamentos', value: formatNumber(feedData.reduce((a, f) => a + f.compartilhamentos, 0)), icon: Share2, color: '#3B82F6', bg: '#dbeafe' },
                    { label: 'Impressões', value: formatNumber(feedData.reduce((a, f) => a + f.impressoes, 0)), icon: Repeat2, color: '#F19877', bg: '#F5F4F2' },
                  ].map(m => (
                    <div key={m.label} style={S.tinted}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                        <m.icon size={14} style={{ color: m.color }} />
                      </div>
                      <p style={{ fontSize: 22, fontWeight: 700, color: '#1F1B1A' }}>{m.value}</p>
                      <p style={{ fontSize: 11, color: 'rgba(31,27,26,0.5)', marginTop: 4 }}>{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Feed posts table */}
                <div style={{ background: '#FFFFFF', border: '1px solid rgba(31,27,26,0.10)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(31,27,26,0.08)' }}>
                    <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 600, color: '#1F1B1A' }}>Posts de feed — performance</h4>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#F5F4F2' }}>
                      <tr>
                        {['Título', 'Tipo', 'Data', 'Alcance', 'Curtidas', 'Salv.', 'Compart.', 'Impressões'].map(h => (
                          <th key={h} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(31,27,26,0.45)', textAlign: 'left', padding: '10px 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {feedData.map((f, i) => (
                        <tr key={f.id} style={{ borderTop: '1px solid rgba(31,27,26,0.05)' }}>
                          <td style={{ fontSize: 13, fontWeight: 600, color: '#1F1B1A', padding: '12px 14px', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.titulo}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: f.tipo === 'Carrossel' ? '#F2F4A4' : '#FBD0DA', color: '#1F1B1A' }}>{f.tipo}</span>
                          </td>
                          <td style={{ fontSize: 12, color: 'rgba(31,27,26,0.5)', padding: '12px 14px' }}>{f.data}</td>
                          <td style={{ fontSize: 13, fontWeight: 700, color: '#F25BA5', padding: '12px 14px' }}>{formatNumber(f.alcance)}</td>
                          <td style={{ fontSize: 13, color: '#1F1B1A', padding: '12px 14px' }}>{formatNumber(f.curtidas)}</td>
                          <td style={{ fontSize: 13, color: '#10B981', fontWeight: 600, padding: '12px 14px' }}>{f.salvamentos}</td>
                          <td style={{ fontSize: 13, color: '#1F1B1A', padding: '12px 14px' }}>{f.compartilhamentos}</td>
                          <td style={{ fontSize: 13, color: '#1F1B1A', padding: '12px 14px' }}>{formatNumber(f.impressoes)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
