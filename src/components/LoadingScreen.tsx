import { Crown } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-center">
        <Crown className="h-12 w-12 text-kpop-purple mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          IdolChat
        </h2>
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-kpop-purple rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-kpop-purple rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-kpop-purple rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-muted-foreground mt-2">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;