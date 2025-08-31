import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  ShoppingCart,
  X,
  DollarSign
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  category: string;
  sku: string;
}

interface AnalyticsPanelProps {
  products: Product[];
  onClose: () => void;
}

export const AnalyticsPanel = ({ products, onClose }: AnalyticsPanelProps) => {
  const analytics = useMemo(() => {
    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum, product) => sum + (product.stock * product.price), 0);
    const averageStockLevel = products.reduce((sum, product) => sum + product.stock, 0) / totalProducts;
    
    const lowStockItems = products.filter(p => p.stock <= p.lowStockThreshold);
    const outOfStockItems = products.filter(p => p.stock === 0);
    const wellStockedItems = products.filter(p => p.stock > p.lowStockThreshold);
    
    // Category analysis
    const categoryStats = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = { count: 0, value: 0, stock: 0 };
      }
      acc[product.category].count += 1;
      acc[product.category].value += product.stock * product.price;
      acc[product.category].stock += product.stock;
      return acc;
    }, {} as Record<string, { count: number; value: number; stock: number }>);

    const topCategories = Object.entries(categoryStats)
      .sort(([,a], [,b]) => b.value - a.value)
      .slice(0, 5);

    const topValueProducts = [...products]
      .sort((a, b) => (b.stock * b.price) - (a.stock * a.price))
      .slice(0, 5);

    return {
      totalProducts,
      totalStockValue,
      averageStockLevel,
      lowStockItems,
      outOfStockItems,
      wellStockedItems,
      topCategories,
      topValueProducts
    };
  }, [products]);

  return (
    <div className="border-b bg-muted/30 animate-slide-in">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Active inventory items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analytics.totalStockValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total inventory value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Stock Level</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averageStockLevel.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Units per product
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{analytics.lowStockItems.length}</div>
              <p className="text-xs text-muted-foreground">
                Need restocking
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stock Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stock Status Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success-light rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="font-medium">Well Stocked</span>
                </div>
                <Badge className="bg-success text-success-foreground">
                  {analytics.wellStockedItems.length} items
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-warning-light rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="font-medium">Low Stock</span>
                </div>
                <Badge className="bg-warning text-warning-foreground">
                  {analytics.lowStockItems.length} items
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-destructive-light rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  <span className="font-medium">Out of Stock</span>
                </div>
                <Badge variant="destructive">
                  {analytics.outOfStockItems.length} items
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Categories by Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topCategories.map(([category, stats], index) => (
                  <div key={category} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">#{index + 1}</span>
                      <span>{category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${stats.value.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        {stats.count} items, {stats.stock} units
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Value Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Highest Value Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topValueProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">#{index + 1}</span>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        SKU: {product.sku} • {product.stock} units @ ${product.price}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">
                      ${(product.stock * product.price).toFixed(2)}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};