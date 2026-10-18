/** Local visual fixture; no provider requests or simulated percentage. */
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { GenerationLoading } from '../src/client/GenerationLoading'
import css from '../src/client/panel.module.css'

function Fixture() {
  const [mode, setMode] = useState('文生图')
  const [state, setState] = useState('running')
  const [dark, setDark] = useState(false)
  const title = state === 'queued' ? '任务排队中…' : state === 'submitting' ? '正在提交任务…' : '正在生成图片…'
  return <div data-dark={dark} className="fixture">
    <header><strong>DSH · 生图动画</strong>
      <select aria-label="模式" value={mode} onChange={event => setMode(event.target.value)}><option>文生图</option><option>图生图</option></select>
      <select aria-label="状态" value={state} onChange={event => setState(event.target.value)}>{['submitting', 'queued', 'running', 'completed', 'failed', 'cancelled'].map(value => <option key={value}>{value}</option>)}</select>
      <label><input type="checkbox" checked={dark} onChange={event => setDark(event.target.checked)} />深色</label>
    </header>
    <main className={css.canvas}>
      {['submitting', 'queued', 'running'].includes(state)
        ? <div className={`${css.canvasState} ${css.generationState}`} role="status" data-generation-state={state}><GenerationLoading title={title} hint={state === 'queued' ? '当前有 1 个任务等待处理' : '已用时 24 秒'} /></div>
        : <div className={css.canvasState} role="status">{state === 'completed' ? '图片已生成' : state === 'failed' ? '生成失败，请重试' : '任务已取消'}</div>}
    </main>
  </div>
}
createRoot(document.getElementById('root')!).render(<Fixture />)
