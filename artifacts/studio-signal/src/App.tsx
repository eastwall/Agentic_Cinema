import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Activity,
  Archive,
  ArrowRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  CircleDot,
  Clock3,
  FileCheck2,
  Film,
  FolderKanban,
  History,
  LayoutDashboard,
  Lightbulb,
  Menu,
  MessageCircle,
  MoreHorizontal,
  MonitorPlay,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();

type AgentState = 'idle' | 'running' | 'done';
type Brief = { title: string; body: string; format: string; audience: string };

const initialBrief: Brief = {
  title: 'Orbit / Season 02 — The Signal',
  body: 'A six-part documentary series about the engineers, artists, and night-shift operators keeping the world connected. The second season moves from infrastructure to the human stories hiding inside it.',
  format: 'Documentary series',
  audience: 'Global / 18–34',
};

const productions = [
  { id: 'orbit-s02', title: 'Orbit / Season 02', type: 'SERIES', description: 'Six films about the people behind the signal.', progress: 62, status: 'In production', date: 'Updated 14 min ago', color: 'sage' },
  { id: 'meridian', title: 'Meridian: After Dark', type: 'SPECIAL', description: 'A midnight portrait of the last great radio tower.', progress: 88, status: 'Final review', date: 'Updated yesterday', color: 'amber' },
  { id: 'common-ground', title: 'Common Ground', type: 'CAMPAIGN', description: 'Four voices, one room, no talking points.', progress: 34, status: 'Pre-production', date: 'Updated 2 days ago', color: 'coral' },
  { id: 'field-notes', title: 'Field Notes / 07', type: 'SHORT', description: 'A 90-second dispatch from the high desert.', progress: 100, status: 'Delivered', date: 'Delivered Mar 04', color: 'blue' },
];

const initialTrail = [
  { icon: FileCheck2, title: 'Plan assembled', description: 'A governed production plan was generated from the Orbit brief.', time: 'Today, 09:42', chips: ['PLAN-1042', '4 controls'] },
  { icon: ShieldCheck, title: 'Rights check passed', description: 'Territory, music, and contributor release requirements verified.', time: 'Today, 09:41', chips: ['CLEAR', 'No blockers'] },
  { icon: Sparkles, title: 'Brief interpreted', description: 'Signal map extracted from 168 words and 3 audience cues.', time: 'Today, 09:41', chips: ['BRIEF-884', '6 signals'] },
  { icon: Users, title: 'Mina joined the room', description: 'Producer access granted by Jonah Reed.', time: 'Yesterday, 16:18', chips: ['MEMBER', 'Producer'] },
];

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [headerToast, setHeaderToast] = useState('');
  const navItems = [
    { href: '/', label: 'Command center', icon: LayoutDashboard },
    { href: '/productions', label: 'Productions', icon: FolderKanban, count: '04' },
    { href: '/ideas', label: 'Idea lab', icon: Lightbulb },
    { href: '/cinemas', label: 'Cinema operations', icon: Building2 },
    { href: '/activity', label: 'Agent trail', icon: Activity },
    { href: '/faq', label: 'FAQ & field guide', icon: CircleHelp },
  ];
  const pageLabel = location === '/productions' ? 'Productions' : location === '/ideas' ? 'Idea lab' : location === '/cinemas' ? 'Cinema operations' : location === '/activity' ? 'Agent trail' : location === '/faq' ? 'FAQ & field guide' : location === '/settings' ? 'Settings' : 'Brief to plan';
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><CircleDot size={17} strokeWidth={2.7} /></div>
          <div><div className="brand-name">Studio Signal</div><div className="brand-kicker">Production OS</div></div>
        </div>
        <button className="workspace-switch" data-testid="button-workspace-switch" onClick={() => setMobileMenu(!mobileMenu)}>
          <div><span>Northstar Studio</span><small>Creative operations</small></div>
          <ChevronDown size={14} />
        </button>
        <div className="nav-label">Workspace</div>
        <nav className="nav" aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon, count }) => (
            <Link href={href} key={href} className={`nav-link ${location === href ? 'active' : ''}`} data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`}>
              <Icon size={15} strokeWidth={1.8} /><span>{label}</span>{count && <span className="nav-count">{count}</span>}
            </Link>
          ))}
          <Link href="/settings" className={`nav-link ${location === '/settings' ? 'active' : ''}`} data-testid="link-settings"><Settings2 size={15} strokeWidth={1.8} /><span>Settings</span></Link>
        </nav>
        {mobileMenu && <div className="mobile-popover"><strong>Northstar Studio</strong><span>Switch workspace</span><button data-testid="button-close-workspace" onClick={() => setMobileMenu(false)}><X size={14} /></button></div>}
        <div className="sidebar-spacer" />
        <a className="community-card" href="https://chat.whatsapp.com/G9KurNgf8fRHih6VoLGGZy" target="_blank" rel="noreferrer" data-testid="link-whatsapp-community">
          <span className="community-icon"><MessageCircle size={15} /></span>
          <span className="community-copy"><strong>Join the community</strong><small>News, events, info + freebies</small></span>
          <ArrowRight size={13} />
        </a>
        <div className="status-strip"><div className="status-dot" /><div className="status-copy"><strong>Systems nominal</strong>All agents operational</div></div>
        <div className="user-row"><div className="avatar">JR</div><div><strong>Jonah Reed</strong><span>Executive producer</span></div><MoreHorizontal size={15} color="#71828b" /></div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Northstar Studio</span><ArrowRight size={12} /><strong>{pageLabel}</strong></div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Search" data-testid="button-search" onClick={() => { setHeaderToast('Search is scoped to this studio'); window.setTimeout(() => setHeaderToast(''), 2200); }}><Search size={15} /></button>
            <button className="icon-button" aria-label="Notifications" data-testid="button-notifications" onClick={() => { setHeaderToast('You are all caught up'); window.setTimeout(() => setHeaderToast(''), 2200); }}><Bell size={15} /></button>
            <button className="icon-button mobile-menu-button" aria-label="Open menu" data-testid="button-mobile-menu" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={16} /></button>
          </div>
        </header>
        {children}
        {headerToast && <div className="toast" data-testid="status-header-toast"><strong>Signal</strong>{headerToast}</div>}
      </main>
    </div>
  );
}

function Home() {
  const [brief, setBrief] = useState(initialBrief);
  const [agentState, setAgentState] = useState<AgentState>('idle');
  const [activeTab, setActiveTab] = useState('Plan overview');
  const [toast, setToast] = useState('');
  const [lastSaved, setLastSaved] = useState(true);

  useEffect(() => {
    if (lastSaved) return;
    const timer = window.setTimeout(() => setLastSaved(true), 750);
    return () => window.clearTimeout(timer);
  }, [brief, lastSaved]);

  const updateBrief = (key: keyof Brief, value: string) => {
    setBrief((current) => ({ ...current, [key]: value }));
    setLastSaved(false);
  };

  const runAgent = () => {
    if (agentState === 'running') return;
    setAgentState('running');
    window.setTimeout(() => {
      setAgentState('done');
      setToast('Plan ready · 4 governance checks passed');
      window.setTimeout(() => setToast(''), 3600);
    }, 1700);
  };

  const planReady = agentState === 'done' || agentState === 'idle';
  return (
    <div className="content">
      <div className="page-heading stagger">
        <div><div className="eyebrow">Orchestration / New intake</div><h1>Turn the brief into a plan.</h1><p>Shape the creative signal. Studio Signal handles the operational noise.</p></div>
        <div className="view-actions">
          <button className="btn btn-quiet" data-testid="button-save-brief" onClick={() => { setLastSaved(true); setToast('Brief saved to intake queue'); window.setTimeout(() => setToast(''), 2400); }}><Archive size={14} /> Save draft</button>
          <button className="btn btn-dark" data-testid="button-new-brief" onClick={() => { setBrief(initialBrief); setAgentState('idle'); setToast('New intake started'); window.setTimeout(() => setToast(''), 2400); }}><Plus size={14} /> New intake</button>
        </div>
      </div>
      <div className="stack-rail stagger">
        <div className="stack-badges">
          <span className="stack-badge"><span className="stack-dot google" /> Gemini Enterprise</span>
          <span className="stack-badge"><span className="stack-dot builder" /> Agent Builder orchestration</span>
          <span className="stack-badge"><span className="stack-dot mcp" /> MCP-ready media actions</span>
        </div>
        <span className="stack-state"><span className="stack-state-dot" /> Demo mode · connections pending</span>
      </div>

      <div className="brief-layout">
        <section className="panel brief-editor stagger stagger-1">
          <div className="panel-header"><div><h2>01 / Source brief</h2><p>Give the room the signal, not a spreadsheet.</p></div><span className="eyebrow">Draft · 884</span></div>
          <div className="panel-body">
            <div className="field-block"><label className="field-label" htmlFor="brief-title">Working title <em>Required</em></label><input id="brief-title" className="brief-title-input" data-testid="input-brief-title" value={brief.title} onChange={(e) => updateBrief('title', e.target.value)} /></div>
            <div className="field-block"><label className="field-label" htmlFor="brief-body">What are we making? <em>{brief.body.length} characters</em></label><textarea id="brief-body" className="brief-textarea" data-testid="input-brief-body" value={brief.body} onChange={(e) => updateBrief('body', e.target.value)} /></div>
            <div className="field-grid">
              <div className="field-block"><label className="field-label" htmlFor="brief-format">Format</label><select id="brief-format" className="select-field" data-testid="select-brief-format" value={brief.format} onChange={(e) => updateBrief('format', e.target.value)}><option>Documentary series</option><option>Feature film</option><option>Campaign</option><option>Short-form collection</option></select></div>
              <div className="field-block"><label className="field-label" htmlFor="brief-audience">Primary audience</label><select id="brief-audience" className="select-field" data-testid="select-brief-audience" value={brief.audience} onChange={(e) => updateBrief('audience', e.target.value)}><option>Global / 18–34</option><option>Global / All ages</option><option>North America / 25–44</option><option>Internal / Stakeholders</option></select></div>
            </div>
            <div className="brief-footer"><div className="save-note">{lastSaved ? <Check size={13} className="saved-icon" /> : <Clock3 size={13} />} {lastSaved ? 'Saved just now' : 'Saving changes…'}</div><button className="btn btn-primary" data-testid="button-run-agent" onClick={runAgent} disabled={agentState === 'running'}><Sparkles size={14} /> {agentState === 'running' ? 'Building plan…' : 'Run Signal agent'} <ArrowRight size={14} /></button></div>
          </div>
        </section>

        <div className="plan-column">
          <section className="agent-card stagger stagger-2">
            <div className="panel-header"><div className="agent-identity"><div className="agent-glyph"><Sparkles size={16} /></div><div><strong>Signal agent</strong><span>Gemini + Agent Builder · governed run</span></div></div><span className="eyebrow">LIVE</span></div>
            <div className="panel-body">
              <div className="eyebrow">{agentState === 'running' ? 'Processing brief' : agentState === 'done' ? 'Plan assembled' : 'Ready to interpret'}</div>
              <button className={`run-button ${agentState}`} data-testid="button-run-signal-agent" onClick={runAgent} disabled={agentState === 'running'}>{agentState === 'running' ? <RefreshCw size={15} /> : agentState === 'done' ? <Check size={15} /> : <Play size={14} fill="currentColor" />} {agentState === 'running' ? 'Interpreting signal' : agentState === 'done' ? 'Run complete' : 'Run agent on this brief'}</button>
              <div className="agent-log">
                <div className={`log-line ${agentState !== 'idle' ? 'complete' : ''}`}><span className="log-dot" /> Extract creative intent <Check size={12} /></div>
                <div className={`log-line ${agentState === 'done' ? 'complete' : agentState === 'running' ? '' : 'pending'}`}><span className="log-dot" /> Map production requirements {agentState === 'done' && <Check size={12} />}</div>
                <div className={`log-line ${agentState === 'done' ? 'complete' : 'pending'}`}><span className="log-dot" /> Apply governance controls {agentState === 'done' && <Check size={12} />}</div>
              </div>
            </div>
          </section>
          <section className="panel plan-preview stagger stagger-3">
            <div className="panel-header"><div><h2>02 / Production plan</h2><p>{agentState === 'running' ? 'The room is assembling your next move.' : 'A decision-ready first pass.'}</p></div>{planReady && <span className="status-pill"><span className="dot" /> {agentState === 'done' ? 'Fresh plan' : 'Preview'}</span>}</div>
            <div className="panel-body">
              {agentState === 'running' ? <div className="skeleton-stack"><div className="skeleton skeleton-wide" /><div className="skeleton" /><div className="skeleton" /><div className="skeleton skeleton-short" /></div> : <><div className="plan-stat-row"><div className="plan-stat"><b>06</b><span>Episodes</span></div><div className="plan-stat"><b>04</b><span>Controls</span></div><div className="plan-stat"><b>11 wk</b><span>Est. runway</span></div></div><div className="plan-list"><div className="plan-item"><div className="check"><Check size={11} /></div><div><strong>Lock contributors & release path</strong><span>Owner · Production / Due week 02</span></div></div><div className="plan-item"><div className="check"><Check size={11} /></div><div><strong>Build a night-shift visual language</strong><span>Owner · Creative / Due week 03</span></div></div><div className="plan-item"><div className="check"><Check size={11} /></div><div><strong>Protect the human story in every cut</strong><span>Owner · Editorial / Due week 07</span></div></div></div></>}
            </div>
          </section>
          <div className="insight-card stagger stagger-3"><Lightbulb size={18} className="insight-icon" /><div><strong>Signal agent noticed a tension.</strong><p>The infrastructure is vast; keep the treatment intimate. Recommend one recurring human anchor per episode.</p></div></div>
        </div>
      </div>

      <div className="lower-grid">
        <section className="panel activity-card"><div className="panel-header"><div><h2>Recent agent activity</h2><p>A traceable record of decisions made in this room.</p></div><Link href="/activity" className="btn btn-quiet" data-testid="link-view-all-activity">View trail <ArrowRight size={13} /></Link></div><div className="activity-list">{initialTrail.slice(0, 3).map((item, index) => { const Icon = item.icon; return <div className="activity-row" key={item.title}><div className="activity-icon"><Icon size={13} /></div><div className="activity-copy"><strong>{item.title}</strong><span>{item.description}</span></div><div className="activity-time">{index === 0 && agentState === 'done' ? 'Just now' : item.time.split(',')[0]}</div></div>; })}</div></section>
        <section className="panel production-card"><div className="panel-header"><div><h2>In focus</h2><p>The production currently taking the room.</p></div><Link href="/productions" className="icon-button" data-testid="link-all-productions"><ArrowRight size={14} /></Link></div><div className="production-hero"><div><div className="eyebrow" style={{ color: '#58706b' }}>Active production</div><h3>Orbit / S02</h3><p>Series · 6 episodes · Global / 18–34</p></div><span className="production-tag">IN PRODUCTION</span></div><div className="progress-line"><div /></div><div className="production-foot"><span>62% planned</span><span>Next gate · Apr 18</span></div></section>
      </div>

      <section className="panel tabs-panel" style={{ marginTop: 18 }}>
        <div className="tab-row">{['Plan overview', 'Decision log', 'Governance'].map((tab) => <button className={`tab ${activeTab === tab ? 'active' : ''}`} data-testid={`tab-${tab.toLowerCase().replaceAll(' ', '-')}`} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>
        <div className="tab-content">{activeTab === 'Plan overview' && <p className="tab-note">The plan is ready for a producer’s review. Nothing is committed until the room approves the next gate.</p>}{activeTab === 'Decision log' && <p className="tab-note">No manual overrides yet. Agent recommendations will appear here as the plan evolves.</p>}{activeTab === 'Governance' && <p className="tab-note"><ShieldCheck size={14} /> Rights, contributor releases, territory, and delivery specs are being tracked from intake.</p>}</div>
      </section>
      {toast && <div className="toast" data-testid="status-toast"><strong>Signal</strong>{toast}</div>}
    </div>
  );
}

function Productions() {
  const [filter, setFilter] = useState('All productions');
  const [notice, setNotice] = useState('');
  const filtered = useMemo(() => filter === 'All productions' ? productions : productions.filter((item) => item.status === filter), [filter]);
  return <div className="content"><div className="page-heading stagger"><div><div className="eyebrow">Workspace / Portfolio</div><h1>Recent productions.</h1><p>Every project, one clear line of sight from signal to screen.</p></div><div className="view-actions"><button className="btn btn-primary" data-testid="button-create-production" onClick={() => { setNotice('New production intake opened'); window.setTimeout(() => setNotice(''), 2400); }}><Plus size={14} /> Create production</button></div></div><div className="tab-row"><button className={`tab ${filter === 'All productions' ? 'active' : ''}`} data-testid="filter-all-productions" onClick={() => setFilter('All productions')}>All productions <span className="nav-count">04</span></button><button className={`tab ${filter === 'In production' ? 'active' : ''}`} data-testid="filter-in-production" onClick={() => setFilter('In production')}>In production</button><button className={`tab ${filter === 'Final review' ? 'active' : ''}`} data-testid="filter-final-review" onClick={() => setFilter('Final review')}>Final review</button></div><div className="production-grid">{filtered.map((item) => <article className="production-tile stagger stagger-1" key={item.id} data-testid={`card-production-${item.id}`}><div className="tile-top"><span className="tile-type">{item.type}</span><time>{item.date}</time></div><h3>{item.title}</h3><p>{item.description}</p><div className="tile-progress"><div style={{ width: `${item.progress}%`, background: item.color === 'coral' ? '#cf735c' : item.color === 'amber' ? '#c4913e' : '#5a9680' }} /></div><div className="tile-footer"><span>{item.status}</span><span>{item.progress}%</span></div><button className="btn btn-quiet tile-button" data-testid={`button-open-production-${item.id}`} onClick={() => { setNotice(`${item.title} is ready to open`); window.setTimeout(() => setNotice(''), 2400); }}>Open production <ArrowRight size={13} /></button></article>)}</div>{filtered.length === 0 && <div className="empty-state"><FolderKanban size={24} /><strong>No productions in this lane</strong><p>Try another filter, or create a new production to bring a brief into the room.</p><button className="btn btn-primary" data-testid="button-empty-create-production" onClick={() => setNotice('New production intake opened')}><Plus size={14} /> Create production</button></div>}{notice && <div className="toast" data-testid="status-production-toast"><strong>Signal</strong>{notice}</div>}</div>;
}

function ActivityPage() {
  const [trail, setTrail] = useState(initialTrail);
  const [toast, setToast] = useState('');
  const clearTrail = () => { setTrail([]); setToast('Trail cleared for this local demo'); window.setTimeout(() => setToast(''), 2400); };
  return <div className="content"><div className="page-heading stagger"><div><div className="eyebrow">Workspace / Traceability</div><h1>Agent trail.</h1><p>Every recommendation has a source, a control, and a timestamp.</p></div><div className="view-actions"><button className="btn btn-quiet" data-testid="button-refresh-trail" onClick={() => setTrail(initialTrail)}><RefreshCw size={14} /> Refresh trail</button><button className="btn btn-dark" data-testid="button-clear-trail" onClick={clearTrail}><Archive size={14} /> Clear demo trail</button></div></div><div className="panel page-card"><div className="panel-header" style={{ padding: '0 0 18px' }}><div><h2>Run history</h2><p>Northstar Studio · local workspace</p></div><span className="status-pill"><span className="dot" /> Governed</span></div>{trail.length ? <div className="trail" style={{ marginTop: 24 }}>{trail.map((item, index) => { const Icon = item.icon; return <div className={`trail-item ${index === 1 ? 'warning' : ''}`} key={item.title}><div className="trail-marker"><Icon size={15} /></div><div className="trail-body"><header><strong>{item.title}</strong><time>{item.time}</time></header><p>{item.description}</p><div className="trail-meta">{item.chips.map((chip) => <span className="meta-chip" key={chip}>{chip}</span>)}</div></div></div>; })}</div> : <div className="empty-state" style={{ marginTop: 22 }}><History size={25} /><strong>No trail entries yet</strong><p>Run the Signal agent from the command center to create a traceable plan history.</p><Link href="/" className="btn btn-primary" data-testid="link-go-to-command-center"><LayoutDashboard size={14} /> Go to command center</Link></div>}</div>{toast && <div className="toast" data-testid="status-trail-toast"><strong>Signal</strong>{toast}</div>}</div>;
}

function IdeaLab() {
  const [thought, setThought] = useState('A tiny neighborhood cinema stays open all night for people who have nowhere else to go.');
  const [destination, setDestination] = useState('Short');
  const [ideaState, setIdeaState] = useState<'idle' | 'shaping' | 'ready'>('idle');
  const [notice, setNotice] = useState('');
  const [activeResult, setActiveResult] = useState('short');
  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };
  const shapeIdea = () => {
    if (!thought.trim() || ideaState === 'shaping') return;
    setIdeaState('shaping');
    window.setTimeout(() => {
      setIdeaState('ready');
      setActiveResult(destination.toLowerCase());
      showNotice('Idea shaped into a production-ready path');
    }, 1300);
  };
  const resultCopy = {
    short: { label: 'A social short', duration: '45–60 sec', summary: 'A focused vertical story built for immediate emotional pull and a fast first watch.', deliverable: 'Beat sheet + shot list + caption pack', color: 'coral' },
    trailer: { label: 'A trailer', duration: '90 sec', summary: 'A cinematic cut that creates a question, establishes the world, and leaves the audience wanting in.', deliverable: 'Trailer treatment + edit map + music brief', color: 'amber' },
    'human professional': { label: 'A human-led production', duration: '2–4 weeks', summary: 'A clear handoff for a director, editor, or producer to take the idea from signal to screen.', deliverable: 'Producer brief + budget shape + crew match', color: 'sage' },
  } as const;
  const result = resultCopy[activeResult as keyof typeof resultCopy] ?? resultCopy.short;
  return (
    <div className="content idea-page">
      <div className="page-heading stagger">
        <div><div className="eyebrow">Origin / Creator intake</div><h1>Start with the thought.</h1><p>Studio Signal gives unfinished ideas a shape, a format, and a way forward.</p></div>
        <div className="view-actions"><span className="creator-chip"><span className="creator-chip-dot" /> Open to ideators</span></div>
      </div>

      <div className="idea-intro stagger stagger-1">
        <div><span className="eyebrow">The idea-to-screen path</span><h2>You bring the spark.<br />We find the next scene.</h2></div>
        <p>Not every good idea arrives as a brief. Write the thought as it exists in your head and Signal will shape a practical route—make it now, pitch it to a cinema, or find the people who can take it further.</p>
      </div>

      <div className="idea-layout">
        <section className="panel idea-editor stagger stagger-2">
          <div className="panel-header"><div><h2>01 / Your raw thought</h2><p>Don’t polish it. Give the room something true.</p></div><span className="eyebrow">Private draft</span></div>
          <div className="panel-body">
            <label className="field-label" htmlFor="idea-thought">What do you want to see on screen? <em>{thought.length} characters</em></label>
            <textarea id="idea-thought" className="idea-textarea" data-testid="input-idea-thought" value={thought} onChange={(e) => { setThought(e.target.value); setIdeaState('idle'); }} placeholder="A memory, a character, a question, a world..." />
            <div className="idea-prompt">Try: “I keep thinking about…” or “What if a film could…”</div>
            <div className="idea-destination-label"><span className="field-label">Where should this go first?</span><span className="eyebrow">Choose a path</span></div>
            <div className="destination-grid">
              {(['Short', 'Trailer', 'Human professional'] as const).map((item) => (
                <button className={`destination-option ${destination === item ? 'selected' : ''}`} key={item} data-testid={`button-destination-${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => { setDestination(item); setIdeaState('idle'); }}>
                  <span className="destination-icon">{item === 'Short' ? <Play size={14} fill="currentColor" /> : item === 'Trailer' ? <Film size={14} /> : <Users size={14} />}</span>
                  <span><strong>{item}</strong><small>{item === 'Short' ? 'Make a moment' : item === 'Trailer' ? 'Build anticipation' : 'Find the right makers'}</small></span>
                  <span className="destination-radio" />
                </button>
              ))}
            </div>
            <div className="idea-editor-footer"><span className="save-note"><Check size={13} className="saved-icon" /> Autosaved to Idea lab</span><button className="btn btn-primary" data-testid="button-shape-idea" onClick={shapeIdea} disabled={ideaState === 'shaping'}><Sparkles size={14} /> {ideaState === 'shaping' ? 'Shaping thought…' : 'Shape this idea'} <ArrowRight size={14} /></button></div>
          </div>
        </section>

        <section className="idea-agent-card stagger stagger-3">
          <div className="idea-agent-head"><div className="agent-identity"><div className="agent-glyph"><Lightbulb size={16} /></div><div><strong>Signal for ideators</strong><span>From first thought to first cut</span></div></div><span className="eyebrow">READY</span></div>
          <div className="idea-agent-body">
            <div className="idea-route"><span className="route-node active">01</span><div><strong>Listen for the signal</strong><span>Find the human hook inside the thought.</span></div></div>
            <div className={`idea-route ${ideaState !== 'idle' ? 'active-route' : ''}`}><span className="route-node">02</span><div><strong>Shape the format</strong><span>Match ambition to a makeable next step.</span></div></div>
            <div className={`idea-route ${ideaState === 'ready' ? 'active-route' : ''}`}><span className="route-node">03</span><div><strong>Open the room</strong><span>Produce it here or invite the right professional.</span></div></div>
          </div>
        </section>
      </div>

      <section className="panel idea-result-panel stagger stagger-3">
        <div className="panel-header"><div><h2>02 / Your next production path</h2><p>{ideaState === 'ready' ? 'A shaped starting point you can act on today.' : 'Shape the idea to see the route Signal recommends.'}</p></div><span className={`status-pill ${ideaState === 'ready' ? 'ready-pill' : ''}`}><span className="dot" /> {ideaState === 'ready' ? 'Ready to make' : 'Waiting for thought'}</span></div>
        <div className="idea-result-body">
          <div className={`result-spotlight ${result.color}`}>
            <span className="eyebrow">Recommended first move</span><h3>{ideaState === 'ready' ? result.label : 'A made-for-you screen path'}</h3><p>{ideaState === 'ready' ? result.summary : 'Signal will turn your thought into something a producer, editor, or cinema partner can understand.'}</p>
            {ideaState === 'ready' && <div className="result-meta"><span><Clock3 size={12} /> {result.duration}</span><span><FileCheck2 size={12} /> {result.deliverable}</span></div>}
          </div>
          <div className="result-actions">
            <span className="eyebrow">What happens next</span>
            <button className="result-action" data-testid="button-open-signal-studio" onClick={() => showNotice('Production workspace opened')}><span className="result-action-icon"><Film size={14} /></span><span><strong>Make it in Signal</strong><small>Turn this path into a guided production workspace.</small></span><ArrowRight size={14} /></button>
            <button className="result-action" data-testid="button-find-professional" onClick={() => showNotice('Professional matching request sent')}><span className="result-action-icon"><Users size={14} /></span><span><strong>Find a human professional</strong><small>Share a concise brief with directors, editors, or producers.</small></span><ArrowRight size={14} /></button>
            <button className="result-action" data-testid="button-share-cinema" onClick={() => showNotice('Cinema house preview prepared')}><span className="result-action-icon"><Building2 size={14} /></span><span><strong>Prepare for cinema houses</strong><small>Build a screening-ready preview and house conversation.</small></span><ArrowRight size={14} /></button>
          </div>
        </div>
      </section>
      {notice && <div className="toast" data-testid="status-idea-toast"><strong>Signal</strong>{notice}</div>}
    </div>
  );
}

function FAQPage() {
  const [category, setCategory] = useState('Everyone');
  const [openQuestion, setOpenQuestion] = useState('What is Studio Signal?');
  const categories = ['Everyone', 'Ideators', 'Cinema houses', 'Production teams'];
  const questions = [
    { category: 'Everyone', question: 'What is Studio Signal?', answer: 'Studio Signal is a shared operating layer for moving an idea from first thought to a finished screen experience. It connects creative intent, production decisions, cinema-house readiness, and human expertise in one traceable workflow.' },
    { category: 'Everyone', question: 'Is Studio Signal an AI video generator?', answer: 'Signal is the agentic coordinator. It interprets the request, shapes the production path, calls the right media tools, and keeps approvals and rights visible. A connected GenMedia or rendering partner can then create and assemble the actual video output.' },
    { category: 'Everyone', question: 'What does “agentic” mean here?', answer: 'Instead of only answering a prompt, Signal breaks the work into steps, chooses the next useful action, records what happened, and pauses when a human decision or approval is required.' },
    { category: 'Everyone', question: 'Can people use it without a production background?', answer: 'Yes. Ideators can start with a rough thought rather than a formal brief. Signal translates it into a makeable format, explains the next step in plain language, and offers either a guided production path or a professional handoff.' },
    { category: 'Ideators', question: 'What should I write in the Idea Lab?', answer: 'Write the thought as it exists in your head: a character, memory, image, question, or situation. You do not need a script. The more human the starting point, the more useful the creative signal becomes.' },
    { category: 'Ideators', question: 'What can Signal make from my idea?', answer: 'Signal can shape an idea into a social short, a trailer, or a production-ready brief for a director, editor, producer, or other human professional. It can also prepare a cinema-house preview when the idea is ready for exhibition.' },
    { category: 'Ideators', question: 'Do I have to make the video myself?', answer: 'No. You can choose a guided path to make it in Signal, or send a concise brief to human professionals who can develop, shoot, edit, and finish the work with you.' },
    { category: 'Cinema houses', question: 'How does this support cinema houses?', answer: 'Cinema Operations gives each venue a shared view of upcoming screening windows, delivery-package readiness, DCP verification, subtitle and accessibility status, playback tests, and the next owner action.' },
    { category: 'Cinema houses', question: 'Can a cinema house receive assets and context together?', answer: 'Yes. The house brief is designed to carry both the delivery package and the story context behind it, so exhibition teams know what to screen, when it is ready, and what audience experience the studio intended.' },
    { category: 'Cinema houses', question: 'Does Signal replace our existing cinema systems?', answer: 'No. Signal is the coordination layer around them. It helps studios and venues agree on assets, readiness, approvals, and next steps without forcing the cinema to abandon its booking, playback, or ticketing systems.' },
    { category: 'Production teams', question: 'Where do human professionals fit?', answer: 'Human professionals stay in the loop wherever taste, judgment, relationships, or accountability matter. Signal can create a sharper brief, recommend the next production move, and make it easier for the right director, editor, producer, or crew to enter the room.' },
    { category: 'Production teams', question: 'Can we keep approvals and rights visible?', answer: 'Yes. Governance controls, rights checks, contributor releases, territory requirements, accessibility metadata, and delivery decisions are represented as explicit steps rather than hidden assumptions.' },
    { category: 'Production teams', question: 'What happens when the agent is unsure?', answer: 'Signal should pause and surface the uncertainty as an attention or approval point. The goal is not to automate away responsibility; it is to make the next human decision clearer and easier to act on.' },
  ];
  const visibleQuestions = questions.filter((item) => item.category === category || category === 'Everyone' && item.category === 'Everyone');
  const toggleQuestion = (question: string) => setOpenQuestion((current) => current === question ? '' : question);
  return (
    <div className="content faq-page">
      <div className="page-heading stagger">
        <div><div className="eyebrow">Support / Field guide</div><h1>Questions for the whole room.</h1><p>Clear answers for the people who imagine, make, screen, and care for the work.</p></div>
        <div className="view-actions"><span className="creator-chip"><span className="creator-chip-dot" /> Human-readable by design</span></div>
      </div>
      <div className="faq-hero stagger stagger-1">
        <div><span className="eyebrow">One workflow, many starting points</span><h2>Every person has a different way into the story.</h2></div>
        <p>Use the field guide to see how Studio Signal supports the first-time ideator, the cinema house preparing opening night, and the professionals turning a strong signal into a finished work.</p>
      </div>
      <div className="faq-layout">
        <aside className="faq-audience stagger stagger-2">
          <span className="eyebrow">Choose your seat</span>
          <div className="faq-category-list">
            {categories.map((item) => <button className={`faq-category ${category === item ? 'selected' : ''}`} key={item} data-testid={`button-faq-${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => { setCategory(item); setOpenQuestion(''); }}><span>{item}</span><ArrowRight size={13} /></button>)}
          </div>
          <div className="faq-audience-note"><CircleHelp size={16} /><p>Still not sure where you fit? Start with <b>Everyone</b>—then follow the question that sounds most like your day.</p></div>
        </aside>
        <section className="faq-list panel stagger stagger-3">
          <div className="panel-header"><div><h2>{category}</h2><p>{visibleQuestions.length} questions in this section</p></div><span className="status-pill"><span className="dot" /> Open guide</span></div>
          <div className="faq-items">
            {visibleQuestions.map((item) => {
              const isOpen = openQuestion === item.question;
              return <div className={`faq-item ${isOpen ? 'open' : ''}`} key={item.question}><button className="faq-question" data-testid={`button-faq-question-${item.question.slice(0, 12).toLowerCase().replaceAll(' ', '-')}`} onClick={() => toggleQuestion(item.question)}><span>{item.question}</span><ChevronDown size={15} /></button>{isOpen && <div className="faq-answer"><p>{item.answer}</p></div>}</div>;
            })}
            {visibleQuestions.length === 0 && <div className="empty-state"><CircleHelp size={24} /><strong>Select an audience to open their guide</strong><p>Choose one of the room roles to see the questions that matter most to them.</p></div>}
          </div>
        </section>
      </div>
      <div className="faq-bottom-note stagger"><span className="stack-dot mcp" /><div><strong>Need a room-specific answer?</strong><p>Signal keeps the workflow open to the people who make the work possible—from first spark to first screening.</p></div><button className="btn btn-dark" data-testid="button-faq-contact" onClick={() => setOpenQuestion('What is Studio Signal?')}>Ask Signal <ArrowRight size={13} /></button></div>
    </div>
  );
}

function CinemaOperations() {
  const [activeLane, setActiveLane] = useState('All venues');
  const [notice, setNotice] = useState('');
  const venueLanes = ['All venues', 'Ready to screen', 'Needs attention'];
  const venues = [
    { id: 'lumen', name: 'Lumen House', city: 'London · 8 screens', status: 'Ready to screen', next: 'Orbit S02 · Apr 18', progress: 100, package: 'DCP verified', tone: 'ready' },
    { id: 'arc', name: 'The Arc Cinema', city: 'Lagos · 5 screens', status: 'Needs attention', next: 'Meridian: After Dark · Apr 22', progress: 74, package: 'Subtitle package missing', tone: 'attention' },
    { id: 'parallax', name: 'Parallax Rooms', city: 'New York · 12 screens', status: 'Ready to screen', next: 'Orbit S02 · Apr 24', progress: 92, package: 'Playback test scheduled', tone: 'scheduled' },
  ];
  const filtered = activeLane === 'All venues' ? venues : venues.filter((venue) => venue.status === activeLane);
  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2400);
  };
  return (
    <div className="content cinema-page">
      <div className="page-heading stagger">
        <div><div className="eyebrow">Network / Exhibition</div><h1>Make every screening land.</h1><p>Studio Signal keeps cinema houses ready from delivery package to opening night.</p></div>
        <div className="view-actions"><button className="btn btn-primary" data-testid="button-add-venue" onClick={() => showNotice('Venue onboarding opened')}><Plus size={14} /> Add venue</button></div>
      </div>

      <div className="cinema-hero stagger stagger-1">
        <div className="cinema-hero-copy">
          <span className="eyebrow">Cinema house network</span>
          <h2>From studio intent to a full house.</h2>
          <p>Give exhibitors one clear place to receive assets, confirm playback, coordinate showtimes, and protect the audience experience.</p>
          <div className="cinema-hero-actions">
            <button className="btn btn-primary" data-testid="button-start-screening-plan" onClick={() => showNotice('Screening plan created for Orbit / Season 02')}><CalendarDays size={14} /> Start screening plan</button>
            <button className="btn btn-quiet light-button" data-testid="button-view-delivery-guide" onClick={() => showNotice('Delivery guide opened')}>View delivery guide <ArrowRight size={13} /></button>
          </div>
        </div>
        <div className="cinema-signal">
          <div className="cinema-signal-top"><span className="signal-orb"><MonitorPlay size={17} /></span><span className="eyebrow">Next house call</span></div>
          <strong>Orbit / Season 02</strong>
          <span className="cinema-signal-meta">Lumen House · London</span>
          <div className="signal-date"><b>APR</b><strong>18</strong><span>Opening night<br />19:30 local</span></div>
        </div>
      </div>

      <div className="cinema-stat-grid stagger stagger-2">
        <div className="cinema-stat"><span className="cinema-stat-icon"><Building2 size={15} /></span><div><b>12</b><span>House partners</span></div><em className="positive">+2 this month</em></div>
        <div className="cinema-stat"><span className="cinema-stat-icon"><Ticket size={15} /></span><div><b>28</b><span>Screening windows</span></div><em>Next 30 days</em></div>
        <div className="cinema-stat"><span className="cinema-stat-icon"><ShieldCheck size={15} /></span><div><b>96%</b><span>Delivery readiness</span></div><em className="positive">+8.4% vs last month</em></div>
        <div className="cinema-stat"><span className="cinema-stat-icon"><Users size={15} /></span><div><b>04</b><span>Open actions</span></div><em className="attention-text">2 need owners</em></div>
      </div>

      <div className="cinema-section-heading"><div><div className="eyebrow">Venue readiness</div><h2>Every house, one clear next move.</h2></div><div className="tab-row compact-tabs">{venueLanes.map((lane) => <button className={`tab ${activeLane === lane ? 'active' : ''}`} key={lane} data-testid={`filter-venue-${lane.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setActiveLane(lane)}>{lane}</button>)}</div></div>
      <div className="venue-grid">
        {filtered.map((venue) => (
          <article className="venue-card stagger stagger-3" key={venue.id} data-testid={`card-venue-${venue.id}`}>
            <div className="venue-card-top"><span className={`venue-status ${venue.tone}`}><span className="dot" /> {venue.status}</span><button className="icon-button" aria-label={`Open ${venue.name}`} data-testid={`button-open-venue-${venue.id}`} onClick={() => showNotice(`${venue.name} workspace opened`)}><ArrowRight size={14} /></button></div>
            <div className="venue-heading"><div className="venue-mark"><Building2 size={16} /></div><div><h3>{venue.name}</h3><p>{venue.city}</p></div></div>
            <div className="venue-next"><span className="eyebrow">Next screening</span><strong>{venue.next}</strong></div>
            <div className="venue-progress"><div><span>Readiness</span><b>{venue.progress}%</b></div><div className="tile-progress"><div style={{ width: `${venue.progress}%`, background: venue.tone === 'attention' ? '#c8795d' : '#5a9680' }} /></div></div>
            <div className={`venue-package ${venue.tone}`}><FileCheck2 size={13} /><span>{venue.package}</span></div>
            <button className="btn btn-quiet venue-action" data-testid={`button-plan-venue-${venue.id}`} onClick={() => showNotice(`Action plan created for ${venue.name}`)}>Open house plan <ArrowRight size={13} /></button>
          </article>
        ))}
      </div>

      <div className="cinema-bottom-grid">
        <section className="panel house-checklist">
          <div className="panel-header"><div><h2>Opening-night checklist</h2><p>Shared by the studio and every cinema house.</p></div><span className="status-pill"><span className="dot" /> 8 of 12 complete</span></div>
          <div className="checklist-list">
            <div className="checklist-row"><span className="check"><Check size={11} /></span><div><strong>Delivery package verified</strong><span>DCP, audio stems, and poster kit</span></div><span className="checklist-owner">Studio</span></div>
            <div className="checklist-row"><span className="check"><Check size={11} /></span><div><strong>Accessibility package attached</strong><span>Captions, audio description, and language metadata</span></div><span className="checklist-owner">Exhibition</span></div>
            <div className="checklist-row open"><span className="check open-check"><Clock3 size={11} /></span><div><strong>Playback test logged</strong><span>Confirm screen, sound, and first-frame timing</span></div><span className="checklist-owner">Venue</span></div>
          </div>
        </section>
        <section className="panel house-insight">
          <div className="eyebrow">Signal for exhibitors</div>
          <h2>Make the room part of the story.</h2>
          <p>The best cinema handoff is more than a file transfer. It gives each house the context to make the audience feel the work exactly as intended.</p>
          <div className="insight-rule"><span className="stack-dot mcp" /> Asset context · <b>3 delivery packages in sync</b></div>
          <button className="btn btn-dark" data-testid="button-share-house-brief" onClick={() => showNotice('House brief ready to share')}><Users size={14} /> Share house brief</button>
        </section>
      </div>
      {notice && <div className="toast" data-testid="status-cinema-toast"><strong>Signal</strong>{notice}</div>}
    </div>
  );
}

function Settings() {
  const [toggles, setToggles] = useState({ approvals: true, notifications: true, guardrails: true });
  const toggle = (key: keyof typeof toggles) => setToggles((current) => ({ ...current, [key]: !current[key] }));
  return <div className="content"><div className="page-heading stagger"><div><div className="eyebrow">Workspace / Configuration</div><h1>Room settings.</h1><p>Decide how the studio moves before the work moves.</p></div></div><div className="panel page-card" style={{ maxWidth: 780 }}><div className="panel-header" style={{ padding: '0 0 18px' }}><div><h2>Operating rules</h2><p>Applied to every new intake in Northstar Studio.</p></div><Settings2 size={17} color="#9b7a3e" /></div>{([{ key: 'approvals', title: 'Require producer approval', copy: 'Plans pause at each gate until a producer commits the decision.' }, { key: 'notifications', title: 'Send room notifications', copy: 'Keep the team close to changes in briefs, gates, and governance.' }, { key: 'guardrails', title: 'Enforce governance guardrails', copy: 'Rights and delivery checks cannot be bypassed from the room.' }] as const).map((item) => <div className="settings-row" key={item.key}><div><strong>{item.title}</strong><p>{item.copy}</p></div><button className={`switch ${toggles[item.key] ? 'on' : ''}`} aria-label={`Toggle ${item.title}`} data-testid={`switch-${item.key}`} onClick={() => toggle(item.key)} /></div>)}</div></div>;
}

function Router() {
  return <Shell><ErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/productions" component={Productions} /><Route path="/ideas" component={IdeaLab} /><Route path="/cinemas" component={CinemaOperations} /><Route path="/activity" component={ActivityPage} /><Route path="/faq" component={FAQPage} /><Route path="/settings" component={Settings} /><Route component={NotFound} /></Switch></ErrorBoundary></Shell>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;