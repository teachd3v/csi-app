// Admin setup — drag-reorder, weighting, live preview
import { useState } from 'react'
import { Glass, Pill, Btn, MobileNav } from '../components'
import { LIKERT, getInstrument, flattenDimensions } from '../data'



function AdminScreen({ onNav, sharedQuestions, setSharedQuestions, activeInstrument }) {
  const instrument = getInstrument(activeInstrument);
  const DIMENSIONS = flattenDimensions(instrument.dimensions);
  const [items, setItems] = useState(sharedQuestions);
  const [editingId, setEditingId] = useState(null);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [draggingId, setDraggingId] = useState(null);
  const [overId, setOverId] = useState(null);

  const updateItem = (id, patch) => {
    setItems((arr) => {
      const next = arr.map((q) => (q.id === id ? { ...q, ...patch } : q));
      setSharedQuestions(next);
      return next;
    });
  };

  const removeItem = (id) => {
    setItems((arr) => {
      const next = arr.filter((q) => q.id !== id);
      setSharedQuestions(next);
      return next;
    });
  };

  const addItem = () => {
    const id = `custom-${Date.now()}`;
    const next = [
      ...items,
      {
        id,
        dimensionId: "tangibles",
        dimensionName: "Tangibles",
        text: "Pertanyaan baru — klik untuk mengedit",
        importance: 4.0,
      },
    ];
    setItems(next);
    setSharedQuestions(next);
    setEditingId(id);
  };

  // Drag and drop
  const onDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e, id) => {
    e.preventDefault();
    setOverId(id);
  };
  const onDrop = (e, id) => {
    e.preventDefault();
    if (!draggingId || draggingId === id) {
      setDraggingId(null);
      setOverId(null);
      return;
    }
    const next = [...items];
    const fromIdx = next.findIndex((q) => q.id === draggingId);
    const toIdx = next.findIndex((q) => q.id === id);
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setItems(next);
    setSharedQuestions(next);
    setDraggingId(null);
    setOverId(null);
  };

  const previewQ = items[Math.min(previewIdx, items.length - 1)];
  const sumMIS = items.reduce((s, q) => s + q.importance, 0) || 1;

  return (
    <div className="csi-page csi-admin">
      <MobileNav 
        title="Admin" 
        onNav={onNav}
      />

      <div className="csi-admin__layout">
        {/* LEFT — Builder */}
        <Glass className="csi-admin__builder">
          <div className="csi-admin__builder-head">
            <div>
              <h3>Pertanyaan ({items.length})</h3>
              <span>Drag <span className="csi-admin__drag-icon">⠿</span> untuk mengubah urutan</span>
            </div>
            <div className="csi-admin__builder-stats">
              <Pill tone="blue">Σ MIS = {sumMIS.toFixed(2)}</Pill>
              <Pill tone="amber">{new Set(items.map((i) => i.dimensionId)).size} dimensi</Pill>
            </div>
          </div>

          <div className="csi-admin__qlist">
            {items.map((q, idx) => (
              <Glass
                key={q.id}
                className={`csi-admin__q ${draggingId === q.id ? "is-dragging" : ""} ${overId === q.id ? "is-over" : ""} ${editingId === q.id ? "is-editing" : ""}`}
                draggable
                onDragStart={(e) => onDragStart(e, q.id)}
                onDragOver={(e) => onDragOver(e, q.id)}
                onDrop={(e) => onDrop(e, q.id)}
                onDragEnd={() => { setDraggingId(null); setOverId(null); }}
                onMouseEnter={() => setPreviewIdx(idx)}
              >
                <div className="csi-admin__q-handle">⠿</div>
                <div className="csi-admin__q-num">{idx + 1}</div>
                <div className="csi-admin__q-body">
                  {editingId === q.id ? (
                    <input
                      autoFocus
                      className="csi-admin__q-input"
                      value={q.text}
                      onChange={(e) => updateItem(q.id, { text: e.target.value })}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                    />
                  ) : (
                    <div className="csi-admin__q-text" onClick={() => setEditingId(q.id)}>
                      {q.text}
                    </div>
                  )}
                  <div className="csi-admin__q-meta">
                    <select
                      className="csi-admin__q-dim"
                      value={q.dimensionId}
                      onChange={(e) => {
                        const d = DIMENSIONS.find((x) => x.id === e.target.value);
                        updateItem(q.id, { dimensionId: d.id, dimensionName: d.name });
                      }}
                    >
                      {DIMENSIONS.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>

                    <div className="csi-admin__q-weight">
                      <label>Importance</label>
                      <input
                        type="range" min="1" max="5" step="0.1"
                        value={q.importance}
                        onChange={(e) => updateItem(q.id, { importance: parseFloat(e.target.value) })}
                      />
                      <span className="csi-admin__q-w-num">{q.importance.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="csi-admin__q-actions">
                  <button title="Edit" onClick={() => setEditingId(editingId === q.id ? null : q.id)}>✎</button>
                  <button title="Hapus" onClick={() => removeItem(q.id)}>✕</button>
                </div>
              </Glass>
            ))}
          </div>

          <button className="csi-admin__add" onClick={addItem}>
            + Tambah Pertanyaan
          </button>
        </Glass>

        {/* RIGHT — Live preview */}
        <div className="csi-admin__right">
          <Glass className="csi-admin__preview">
            <div className="csi-admin__preview-head">
              <Pill tone="amber">⚡ Live Preview</Pill>
              <span>Tampilan responden · realtime</span>
            </div>

            <div className="csi-admin__phone">
              <div className="csi-admin__phone-bar">
                <span>Survey CSI</span>
                <span>{Math.min(previewIdx + 1, items.length)}/{items.length}</span>
              </div>
              <div className="csi-admin__phone-progress">
                <div style={{ width: `${((previewIdx + 1) / items.length) * 100}%` }} />
              </div>
              {previewQ && (
                <div className="csi-admin__phone-card" key={previewQ.id}>
                  <Pill tone="blue">{previewQ.dimensionName}</Pill>
                  <div className="csi-admin__phone-q">
                    <span>Q{previewIdx + 1}.</span> {previewQ.text}
                  </div>
                  <div className="csi-admin__phone-likert">
                    {LIKERT.map((l) => (
                      <button key={l.value} className="csi-admin__phone-l">
                        <span>{l.emoji}</span>
                        <small>{l.value}</small>
                      </button>
                    ))}
                  </div>
                  <div className="csi-admin__phone-meta">
                    Bobot: <b>{previewQ.importance.toFixed(1)}</b> · WF: <b>{((previewQ.importance / sumMIS) * 100).toFixed(1)}%</b>
                  </div>
                </div>
              )}
            </div>

            <div className="csi-admin__preview-foot">
              <button onClick={() => setPreviewIdx(Math.max(0, previewIdx - 1))} disabled={previewIdx === 0}>← Prev</button>
              <span>{previewIdx + 1} / {items.length}</span>
              <button onClick={() => setPreviewIdx(Math.min(items.length - 1, previewIdx + 1))} disabled={previewIdx >= items.length - 1}>Next →</button>
            </div>
          </Glass>

          <Glass className="csi-admin__weights">
            <h3>Distribusi Bobot</h3>
            <div className="csi-admin__weight-list">
              {DIMENSIONS.map((d) => {
                const dimQs = items.filter((q) => q.dimensionId === d.id);
                const dimSum = dimQs.reduce((s, q) => s + q.importance, 0);
                const pct = (dimSum / sumMIS) * 100;
                return (
                  <div key={d.id} className="csi-admin__weight-row">
                    <span className="csi-admin__weight-name">{d.name}</span>
                    <div className="csi-admin__weight-bar">
                      <div className="csi-admin__weight-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="csi-admin__weight-num">{pct.toFixed(1)}%</span>
                    <span className="csi-admin__weight-cnt">{dimQs.length}</span>
                  </div>
                );
              })}
            </div>
          </Glass>
        </div>
      </div>
    </div>
  );
}

export { AdminScreen }
