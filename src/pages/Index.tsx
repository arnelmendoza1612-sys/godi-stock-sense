import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, BarChart3, HelpCircle, Package } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { AddSaleModal } from "@/components/AddSaleModal";
import { RestockModal } from "@/components/RestockModal";
import { TutorialModal } from "@/components/TutorialModal";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { LowStockAlert } from "@/components/LowStockAlert";
import { useToast } from "@/hooks/use-toast";

// Sample inventory data - in a real app this would come from a database
const initialProducts = [
  { id: 1, name: "Premium Coffee Beans", price: 24.99, stock: 5, lowStockThreshold: 10, category: "Beverages", sku: "CB001" },
  { id: 2, name: "Wireless Bluetooth Headphones", price: 89.99, stock: 15, lowStockThreshold: 5, category: "Electronics", sku: "BH002" },
  { id: 3, name: "Organic Green Tea", price: 18.50, stock: 3, lowStockThreshold: 8, category: "Beverages", sku: "GT003" },
  { id: 4, name: "Smartphone Case", price: 29.99, stock: 25, lowStockThreshold: 10, category: "Accessories", sku: "SC004" },
  { id: 5, name: "Premium Chocolate Bar", price: 12.99, stock: 1, lowStockThreshold: 5, category: "Food", sku: "CB005" },
  { id: 6, name: "Notebook Set", price: 15.99, stock: 40, lowStockThreshold: 15, category: "Stationery", sku: "NB006" },
];

const Index = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { toast } = useToast();

  // Get categories for filter
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Get low stock products
  const lowStockProducts = useMemo(() => {
    return products.filter(product => product.stock <= product.lowStockThreshold);
  }, [products]);

  const handleSale = (productId: number, quantity: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const newStock = Math.max(0, product.stock - quantity);
        if (newStock === 0) {
          toast({
            title: "Stock Alert",
            description: `${product.name} is now out of stock!`,
            variant: "destructive",
          });
        } else if (newStock <= product.lowStockThreshold) {
          toast({
            title: "Low Stock Alert",
            description: `${product.name} is running low (${newStock} remaining)`,
            variant: "destructive",
          });
        }
        return { ...product, stock: newStock };
      }
      return product;
    }));
    
    toast({
      title: "Sale Recorded",
      description: `Successfully sold ${quantity} unit(s)`,
    });
  };

  const handleRestock = (productId: number, quantity: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        return { ...product, stock: product.stock + quantity };
      }
      return product;
    }));
    
    toast({
      title: "Stock Updated",
      description: `Successfully added ${quantity} unit(s)`,
    });
  };

  const openSaleModal = (product) => {
    setSelectedProduct(product);
    setSaleModalOpen(true);
  };

  const openRestockModal = (product) => {
    setSelectedProduct(product);
    setRestockModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary to-primary-hover rounded-lg">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">GODI</h1>
                <p className="text-sm text-muted-foreground">Inventory Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnalytics(!showAnalytics)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTutorialOpen(true)}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Tutorial
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <LowStockAlert products={lowStockProducts} />
      )}

      {/* Analytics Panel */}
      {showAnalytics && (
        <AnalyticsPanel 
          products={products} 
          onClose={() => setShowAnalytics(false)} 
        />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSale={() => openSaleModal(product)}
              onRestock={() => openRestockModal(product)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddSaleModal
        product={selectedProduct}
        open={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        onConfirm={handleSale}
      />

      <RestockModal
        product={selectedProduct}
        open={restockModalOpen}
        onClose={() => setRestockModalOpen(false)}
        onConfirm={handleRestock}
      />

      <TutorialModal
        open={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
      />
    </div>
  );
};

export default Index;