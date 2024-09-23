import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PublishButtonProps {
  username: string;
}

const PublishButton: React.FC<PublishButtonProps> = ({ username }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [error, setError] = useState('');

  const handlePublish = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.url) {
        setDeploymentUrl(data.url);
      } else {
        throw new Error('No deployment URL received');
      }
    } catch (error) {
      console.error('Deployment failed:', error);
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(`Deployment failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handlePublish} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Publishing...
          </>
        ) : (
          'Publish'
        )}
      </Button>
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {deploymentUrl && (
        <p className="mt-2">
          Your portfolio is live at: <a href={deploymentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{deploymentUrl}</a>
        </p>
      )}
    </div>
  );
};

export default PublishButton;