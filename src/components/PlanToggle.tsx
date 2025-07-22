import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export type PlanType = 'free' | 'basic' | 'fan' | 'dorameira';

interface PlanToggleProps {
  onPlanChange: (plan: PlanType) => void;
}

const PlanToggle: React.FC<PlanToggleProps> = ({ onPlanChange }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('free');
  const [isVisible, setIsVisible] = useState(false);

  // Show/hide with keyboard shortcut (Alt + D for Developer)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'd') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  const handlePlanChange = (plan: PlanType) => {
    setSelectedPlan(plan);
    onPlanChange(plan);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-card border shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium">Modo Desenvolvedor</span>
            {isVisible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="ml-auto h-6 w-6 p-0"
              >
                ×
              </Button>
            )}
            {!isVisible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(true)}
                className="ml-auto h-6 w-6 p-0"
              >
                +
              </Button>
            )}
          </div>
          
          {isVisible && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Visualizar como:</p>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedPlan === 'free' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePlanChange('free')}
                  className="text-xs"
                >
                  Gratuito
                </Button>
                
                <Button
                  variant={selectedPlan === 'basic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePlanChange('basic')}
                  className="text-xs"
                >
                  Básico
                </Button>
                
                <Button
                  variant={selectedPlan === 'fan' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePlanChange('fan')}
                  className="text-xs"
                >
                  Fã
                </Button>
                
                <Button
                  variant={selectedPlan === 'dorameira' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePlanChange('dorameira')}
                  className="text-xs"
                >
                  Dorameira
                </Button>
              </div>
              
              <Badge variant="secondary" className="text-xs">
                Alt + D para mostrar/ocultar
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanToggle;