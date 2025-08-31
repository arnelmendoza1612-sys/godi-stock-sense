import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, Minus, Plus } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  category: string;
  sku: string;
}

interface RestockModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (productId: number, quantity: number) => void;
}

export const RestockModal = ({ product, open, onClose, onConfirm }: RestockModalProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = () => {
    if (product && quantity > 0) {
      onConfirm(product.id, quantity);
      setQuantity(1);
      onClose();
    }
  };

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  const adjustQuantity = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  if (!product) return null;

  const newStockLevel = product.stock + quantity;
  const isValidQuantity = quantity > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-success" />
            Restock Inventory
          </DialogTitle>
          <DialogDescription>
            Add inventory for {product.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Product Info */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{product.name}</span>
              <span className="text-primary font-semibold">${product.price}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>SKU: {product.sku}</span>
              <span>Current Stock: {product.stock} units</span>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="restock-quantity">Quantity to Add</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustQuantity(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="restock-quantity"
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  if (val >= 1) {
                    setQuantity(val);
                  }
                }}
                className="text-center"
                min={1}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustQuantity(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* New Stock Level */}
          <div className="bg-success/10 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">New Stock Level:</span>
              <span className="text-2xl font-bold text-success">{newStockLevel} units</span>
            </div>
            {newStockLevel > product.lowStockThreshold && (
              <p className="text-sm text-success mt-1">
                ✓ Stock will be above low stock threshold
              </p>
            )}
          </div>

          {/* Quick Restock Options */}
          <div className="space-y-2">
            <Label>Quick Options</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(product.lowStockThreshold - product.stock)}
                disabled={product.stock >= product.lowStockThreshold}
              >
                Fill to Threshold
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(product.lowStockThreshold * 2 - product.stock)}
                disabled={product.stock >= product.lowStockThreshold * 2}
              >
                Fill to 2x Threshold
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValidQuantity}
            className="bg-gradient-to-r from-success to-success hover:from-success/90 hover:to-success/90 text-success-foreground"
          >
            Add Stock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};