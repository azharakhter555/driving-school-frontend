export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About ServiceHub</h1>
        
        <div className="bg-white rounded-lg shadow p-8 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">This page uses the root layout</h2>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              Notice that this page has the navbar and footer from <code className="bg-gray-100 px-2 py-1 rounded">app/layout.tsx</code>
            </p>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-bold mb-2">Layout Comparison:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Home & About pages</strong> → Use root layout (navbar + footer)</li>
                <li><strong>Login/Signup pages</strong> → Use auth layout (clean, centered)</li>
                <li><strong>Future: Dashboard pages</strong> → Will use dashboard layout (sidebar)</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold mb-2">Test Navigation:</h3>
              <div className="flex flex-wrap gap-3">
                {/* <a href="/" className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                  ← Back to Home
                </a>
                <a href="/login" className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200">
                  Go to Login
                </a>
                <a href="/signup" className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200">
                  Go to Signup
                </a> */}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-xl font-bold mb-4">Project Structure Summary:</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`app/
├── layout.tsx           # Root layout (navbar + footer)
├── page.tsx            # Home page (/)
├── about/
│   └── page.tsx        # About page (/about)
└── (auth)/             # Route group - no /auth/ in URL
    ├── layout.tsx      # Auth layout (clean, centered)
    ├── login/page.tsx  # /login
    ├── signup/page.tsx # /signup
    └── forgot-password/page.tsx # /forgot-password`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}