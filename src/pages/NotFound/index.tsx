import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-gray-300 mb-2">Page not found</p>
        <p className="text-gray-400 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 mx-auto"
        >
          <Home size={20} />
          Back to home
        </Button>
      </div>
    </div>
  );
}
