import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-6">
      <div className="text-center max-w-md">
        {/* 404 Graphic */}
        <div className="relative mb-8">
          <span className="text-[10rem] font-black text-surface-100 dark:text-surface-800 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-semibold text-surface-600 dark:text-surface-300">
                Page not found
              </p>
            </div>
          </div>
        </div>

        <p className="text-surface-500 dark:text-surface-400 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            leftIcon={ArrowLeft}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
          <Link to="/dashboard">
            <Button leftIcon={Home}>Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
