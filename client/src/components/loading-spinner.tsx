import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" data-testid="loading-spinner" />
        <p className="text-muted-foreground" data-testid="loading-text">Loading...</p>
      </div>
    </div>
  );
}
