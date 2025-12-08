import React, { useState } from 'react';
import {
  api
} from '../utils/apiClient';
import {
  Code,
  Send,
  Terminal,
  Book,
  AlertCircle,
  CheckCircle,
  Copy,
  Loader
} from 'lucide-react';

const APITester: React.FC = () => {
  const [endpoint, setEndpoint] = useState('/api/health');
  const [method, setMethod] = useState('GET');
  const [requestBody, setRequestBody] = useState('{}');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl: string = (import.meta.env.VITE_API_URL as string) || (import.meta.env.MODE === 'development' ? 'http://localhost:8787' : '');

  const testEndpoint = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': localStorage.getItem('user_id') || ''
        }
      };

      if (method !== 'GET' && requestBody) {
        options.body = requestBody;
      }

      const fullUrl = `${apiUrl}${endpoint}`;
      console.log('Request:', { method, url: fullUrl, body: requestBody });

      const res = await fetch(fullUrl, options);
      const data = await res.json();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickTests = [
    { name: 'Health Check', method: 'GET', endpoint: '/api/health', body: '{}' },
    { name: 'Exam Stats', method: 'GET', endpoint: '/api/exams/stats', body: '{}' },
    { name: 'Progress Stats', method: 'GET', endpoint: '/api/progress/stats', body: '{}' },
    { name: 'Leaderboard', method: 'GET', endpoint: '/api/leaderboard', body: '{}' },
    { name: 'Update User', method: 'POST', endpoint: '/api/management/update-user', body: '{\n  "targetUserId": "USER_ID_HERE",\n  "data": {\n    "displayName": "New Name",\n    "bio": "Updated Bio"\n  }\n}' },
    { name: 'Change Password', method: 'POST', endpoint: '/api/management/change-password', body: '{\n  "targetUserId": "USER_ID_HERE",\n  "newPassword": "newpassword123"\n}' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <Code size={200} />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <Terminal className="w-8 h-8" />
            API Tester
          </h1>
          <p className="text-center text-blue-100 text-lg">
            Test các API endpoints và xem request/response
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Request */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Send className="w-6 h-6 text-blue-600" />
            Request
          </h2>

          {/* Quick Tests */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Quick Tests</label>
            <div className="flex flex-wrap gap-2">
              {quickTests.map((test) => (
                <button
                  key={test.name}
                  onClick={() => {
                    setMethod(test.method);
                    setEndpoint(test.endpoint);
                    setRequestBody(test.body);
                  }}
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {test.name}
                </button>
              ))}
            </div>
          </div>

          {/* API URL */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">API Base URL</label>
            <input
              type="text"
              value={apiUrl}
              disabled
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-sm font-mono text-gray-600"
            />
          </div>

          {/* Method */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          {/* Endpoint */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Endpoint</label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/api/health"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          {/* Request Body */}
          {method !== 'GET' && (
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Request Body (JSON)</label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                placeholder='{"key": "value"}'
              />
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={testEndpoint}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Request
              </>
            )}
          </button>
        </div>

        {/* Right Panel - Response */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-green-600" />
            Response
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Error
              </p>
              <p className="text-red-600 text-sm mt-2">{error}</p>
            </div>
          )}

          {response && (
            <div className="space-y-4">
              {/* Status */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <p className="text-sm text-gray-600 mb-1 font-medium">Status</p>
                <p className={`text-xl font-bold flex items-center gap-2 ${response.status >= 200 && response.status < 300 ? 'text-green-600' : 'text-red-600'}`}>
                  {response.status >= 200 && response.status < 300 ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  {response.status} {response.statusText}
                </p>
              </div>

              {/* Body */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Response Body</p>
                <div className="p-4 bg-gray-900 rounded-xl overflow-auto max-h-96">
                  <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
                  alert('Response copied to clipboard!');
                }}
                className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Response
              </button>
            </div>
          )}

          {!response && !error && (
            <div className="text-center text-gray-400 py-16">
              <Code className="w-16 h-16 mx-auto mb-4" />
              <p className="font-medium">Send a request to see the response</p>
            </div>
          )}
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Book className="w-6 h-6 text-indigo-600" />
          API Documentation
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Available Endpoints</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">GET /api/health</code> - Health check</li>
              <li>• <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">GET /api/exams</code> - Get all exams</li>
              <li>• <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">POST /api/exams</code> - Create exam</li>
              <li>• <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">GET /api/flashcards/decks</code> - Get decks</li>
              <li>• <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">GET /api/progress/stats</code> - Get stats</li>
              <li>• <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">GET /api/leaderboard</code> - Get rankings</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-3">Headers Required</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">Content-Type: application/json</code></li>
              <li>• <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">X-User-ID: [user_id]</code> - Auto added</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITester;
