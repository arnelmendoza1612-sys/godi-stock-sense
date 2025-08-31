import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, AlertTriangle, Package } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  category: string;
  sku: string;
}

interface ProductCardProps {
  product: Product;
  onSale: () => void;
  onRestock: () => void;
}

export const ProductCard = ({ product, onSale, onRestock }: ProductCardProps) => {
  const getStockStatus = () => {
    if (product.stock === 0) return "out";
    if (product.stock <= product.lowStockThreshold) return "low";
    if (product.stock <= product.lowStockThreshold * 2) return "medium";
    return "good";
  };

  const getStockBadge = () => {
    const status = getStockStatus();
    switch (status) {
      case "out":
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Out of Stock
        </Badge>;
      case "low":
        return <Badge className="status-low flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Low Stock
        </Badge>;
      case "medium":
        return <Badge className="status-medium flex items-center gap-1">
          <Package className="h-3 w-3" />
          Medium Stock
        </Badge>;
      default:
        return <Badge className="status-good flex items-center gap-1">
          <Package className="h-3 w-3" />
          In Stock
        </Badge>;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 animate-slide-in border-border/50 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          </div>
          {getStockBadge()}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-semibold text-lg text-primary">${product.price}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Stock</span>
            <span className={`font-semibold ${product.stock <= product.lowStockThreshold ? 'text-destructive' : 'text-foreground'}`}>
              {product.stock} units
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Category</span>
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button
          onClick={onSale}
          disabled={product.stock === 0}
          className="flex-1 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary disabled:opacity-50"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add Sale
        </Button>
        <Button
          onClick={onRestock}
          variant="outline"
          size="sm"
          className="flex-1 hover:bg-success hover:text-success-foreground hover:border-success transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Restock
        </Button>
      </CardFooter>
    </Card>
  );
};