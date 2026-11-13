import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

/**
 * The last safety net: if a screen throws while drawing, the visitor gets a
 * short message and a reload button instead of a blank page. It sits outside
 * the language provider, so it says its three lines in all three languages.
 */
export default class CrashGuard extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false }

  static getDerivedStateFromError() {
    return { crashed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Qirat screen crashed', error, info.componentStack)
  }

  render() {
    if (!this.state.crashed) return this.props.children
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="card w-full space-y-2 p-6">
          <p className="font-semibold" dir="rtl" lang="ar">
            صار مشكل في الصفحة هاذي.
          </p>
          <p className="text-sm text-muted" lang="fr">
            Un problème est survenu sur cet écran.
          </p>
          <p className="text-sm text-muted" lang="en">
            Something went wrong on this screen.
          </p>
          <p className="pt-1 text-xs text-muted" lang="en">
            Your lessons and practice wallet are still saved.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 cursor-pointer rounded-full bg-text px-5 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90"
          >
            <span lang="ar">عاود حلّ الصفحة</span> · Recharger · Reload
          </button>
        </div>
      </div>
    )
  }
}
