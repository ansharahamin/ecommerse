import { useState } from 'react'

export default function AuthPage({ mode, onSubmit, navigate, loading, error }) {
  const [form, setForm] = useState({ userName: '', email: '', password: '' })
  const isRegister = mode === 'register'

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function submit(event) {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <main className="auth-page">
      <div className="auth-image">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85"
          alt="A warm, sunlit home interior"
        />
        <div className="auth-image-caption">A little more good<br />in your everyday.</div>
      </div>
      <div className="auth-panel">
        <span className="eyebrow"><span className="eyebrow-line" /> Welcome to Kindred</span>
        <h1>{isRegister ? 'Make yourself at home.' : 'Good to see you again.'}</h1>
        <p className="auth-subtitle">{isRegister ? 'Create an account to keep your good things close.' : 'Sign in to find your good things.'}</p>
        <form className="auth-form" onSubmit={submit}>
          {isRegister && (
            <label>
              Your name
              <input autoComplete="username" name="userName" onChange={update} placeholder="What should we call you?" required value={form.userName} />
            </label>
          )}
          <label>
            Email address
            <input autoComplete="email" name="email" onChange={update} placeholder="you@example.com" required type="email" value={form.email} />
          </label>
          <label>
            Password
            <input autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={6} name="password" onChange={update} placeholder="At least 6 characters" required type="password" value={form.password} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark auth-submit" disabled={loading} type="submit">
            {loading ? 'One moment...' : isRegister ? 'Create account' : 'Sign in'} <span aria-hidden="true">↗</span>
          </button>
        </form>
        <p className="auth-switch">
          {isRegister ? 'Already part of the family?' : 'New around here?'}{' '}
          <button onClick={() => navigate(isRegister ? '/login' : '/register')} type="button">
            {isRegister ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </div>
    </main>
  )
}
