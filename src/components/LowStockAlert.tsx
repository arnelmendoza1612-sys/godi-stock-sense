import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Package } from "lucide-react";

interface Product {
  id: number;
  name: string;
  stock: number;
  lowStockThreshold: number;
}

interface LowStockAlertProps {
  products: Product[];
}

export const LowStockAlert = ({ products }: LowStockAlertProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || products.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-2">
      <Alert className="border-destructive/50 bg-destructive-light animate-slide-in">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-destructive">
              {products.length} item{products.length > 1 ? 's' : ''} running low:
            </span>
            <div className="flex flex-wrap gap-1">
              {products.slice(0, 3).map((product, index) => (
                <span key={product.id} className="text-sm">
                  {product.name} ({product.stock} left)
                  {index < Math.min(products.length, 3) - 1 ? ',' : ''}
                </span>
              ))}
              {products.length > 3 && (
                <span className="text-sm font-medium">
                  +{products.length - 3} more
                </span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="h-auto p-1 hover:bg-destructive/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};