import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          backgroundColor: '#f8fafc',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ maxWidth: '600px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
              Oops! Something went wrong
            </h1>
            <p style={{ color: '#64748b', marginBottom: '2rem', lineHeight: '1.6' }}>
              An unexpected error occurred. Please refresh the page to try again.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details style={{
                textAlign: 'left',
                padding: '1rem',
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                marginBottom: '2rem'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#1e3a8a' }}>
                  Error details
                </summary>
                <pre style={{
                  marginTop: '1rem',
                  overflow: 'auto',
                  color: '#dc2626',
                  fontSize: '12px'
                }}>
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#1e3a8a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
