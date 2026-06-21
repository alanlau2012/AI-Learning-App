function App() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-muted)',
          fontSize: '13px',
          letterSpacing: '0.08em',
        }}
      >
        MVP · v1
      </span>
      <h1 style={{ color: 'var(--color-title)' }}>AI 应用工程学习 APP</h1>
      <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>骨架就绪</p>
      <p style={{ color: 'var(--color-muted)', maxWidth: '460px' }}>
        阶段 1-A：工程骨架已初始化。路由、侧栏与页面将在后续阶段接入。
      </p>
    </main>
  )
}

export default App
